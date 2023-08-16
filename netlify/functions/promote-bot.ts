import dedent from "dedent";
import Moralis from "moralis-v1/node";
import { Octokit } from "@octokit/core";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
import { isAfter, isBefore } from "date-fns";
const sharp = require("sharp");

import {
  nextBotQualifier,
  moralisAppId,
  moralisServerUrl,
  token,
} from "../_config";
import { BotFileData, BotPromotionRequest } from "../../types/user";
import { Username } from "../../types/shared";
import { sendConfirmationEmail, getGroupEmails } from "../util/user-utils";
import { checkAuth, checkBotAuth } from "../util/auth-utils";
import { isDangerousHandle } from "../util/validation-utils";

const START = new Date(nextBotQualifier.start);
const END = new Date(nextBotQualifier.end);

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

exports.handler = async (event) => {
  if (!(await checkAuth(event))) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  // only allow POST
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Method not allowed",
        }),
        headers: { Allow: "POST" },
      };
    }

    // check that application was submitted within the application window
    const now = Date.now();

    if (isBefore(now, START) || isAfter(now, END)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Bot applications are only accepted within the bot registration window.",
        }),
      };
    }

    const data: BotPromotionRequest = JSON.parse(event.body);
    const { botName, submission } = data;
    // ensure we have the data we need
    if (!botName) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Bot name is required.",
        }),
      };
    }

    if (isDangerousHandle(botName)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Bot name can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    const username: Username = event.headers["c4-user"];
    const oldBotData = await checkBotAuth(botName, username);
    delete oldBotData.imageUrl;

    const formattedBotData: BotFileData = {
      ...oldBotData,
      relegated: false,
    };

    const files: { [path: string]: string | File } = {
      [`_data/bots/${botName}.json`]: JSON.stringify(formattedBotData, null, 2),
    };

    await Moralis.start({
      serverUrl: moralisServerUrl,
      appId: moralisAppId,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });

    const userQuery = new Moralis.Query("_User");
    userQuery.equalTo("username", username);
    userQuery.select("gitHubUsername");
    const user = await userQuery.find({ useMasterKey: true });
    const gitHubUsername = user[0].attributes["gitHubUsername"];

    const branchName = `bot/${botName}`;
    const title = `Promote bot ${botName}`;
    const body = dedent`
    Promotion for bot ${botName} submitted by ${username}.

    ${gitHubUsername && "@" + gitHubUsername}
    `;

    // create file for bot account
    const promotionResponse = await octokit.createPullRequest({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: process.env.REPO!,
      title,
      body,
      head: branchName,
      base: process.env.BRANCH_NAME,
      changes: [
        {
          files,
          commit: title,
        },
      ],
    });

    if (!promotionResponse) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to create pull request." }),
      };
    }

    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.REPO!,
        issue_number: promotionResponse!.data.number,
        labels: ["bot-promotion"],
      }
    );

    // submit application entry
    const submissionBody = dedent`
    Bot registration PR: ${promotionResponse.data.html_url}

    Bot submission:

    ${submission}
    `;

    const issueResult = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: "bot-applications",
        title: `${botName} Bot Application`,
        body: submissionBody,
        labels: ["QA (Quality Assurance)"],
      }
    );

    const issueId = issueResult.data.number;
    const issueUrl = issueResult.data.html_url;
    const message = `${botName} issue #${issueId}`;
    const path = `data/${botName}-${issueId}.json`;

    const fileData = {
      handle: botName,
      crew: oldBotData.crew,
      issueId,
      issueUrl,
    };

    const content = Buffer.from(JSON.stringify(fileData, null, 2)).toString(
      "base64"
    );

    // add data file for application entry
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: "bot-applications",
      path,
      message,
      content,
    });

    const emails = await getGroupEmails(oldBotData.crew);
    const emailSubject = `Application to promote bot "${botName}" has been submitted`;
    const emailBody = dedent`
    An application to promote the bot ${botName} from relegation has been received.

    You can see the PR here: ${promotionResponse.data.html_url}
    `;
    await sendConfirmationEmail(emails, emailSubject, emailBody);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Created PR ${promotionResponse.data.number}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: error?.status || error?.response?.status || 500,
      body: JSON.stringify({
        error:
          error?.message ||
          error?.response?.data?.message ||
          "Internal server error.",
      }),
    };
  }
};
