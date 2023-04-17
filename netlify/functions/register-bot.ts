import dedent from "dedent";
import { readFileSync } from "fs";
import Moralis from "moralis-v1/node";
import { Octokit } from "@octokit/core";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
const sharp = require("sharp");

import { moralisAppId, moralisServerUrl, token } from "../_config";
import {
  BotCreateRequest,
  BotFileData,
  PaymentAddress,
  UserFileData,
} from "../../types/user";
import { sendConfirmationEmail, getGroupEmails } from "../util/user-utils";
import { checkAuth } from "../util/auth-utils";
import { isDangerousHandle } from "../util/validation-utils";
import { isAfter, isBefore } from "date-fns";

const START = new Date("2023-04-12T20:00:00.000Z");
const END = new Date("2023-04-12T21:00:00.000Z");

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

    const data: BotCreateRequest = JSON.parse(event.body);
    const {
      botName,
      image,
      crewMembers,
      description,
      submission,
      polygonAddress,
      ethereumAddress,
    } = data;
    const username = event.headers["c4-user"];

    // ensure we have the data we need
    if (!botName) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Bot name is required.",
        }),
      };
    }

    if (botName.length > 25) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bot name's length is limited to 25 characters.",
        }),
      };
    }

    if (!crewMembers || !crewMembers.includes(username)) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "You must be listed on the crew for any bot you register.",
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

    // make sure bot name is not already taken as a warden/team name
    try {
      const existingUser: UserFileData = JSON.parse(
        readFileSync(`./_data/handles/${botName}.json`).toString()
      );
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `${botName} is already a registered username`,
          }),
        };
      }
    } catch (error) {
      // do nothing - if this error is caught, then the bot name is valid
    }

    // make sure bot name is not already taken by another bot
    try {
      const existingBot: BotFileData = JSON.parse(
        readFileSync(`./_data/bots/${botName},json`).toString()
      );
      if (existingBot) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `${botName} is already a registered bot name`,
          }),
        };
      }
    } catch (error) {
      // do nothing - if this error is caught, then the bot name is valid
    }

    const paymentAddresses: PaymentAddress[] = [
      { chain: "polygon", address: polygonAddress },
    ];
    if (ethereumAddress) {
      paymentAddresses.push({ chain: "ethereum", address: ethereumAddress });
    }

    const formattedBotData: BotFileData = {
      handle: botName,
      crew: crewMembers,
      paymentAddresses,
    };

    let avatarFilename = "";
    let base64Avatar = "";
    if (image) {
      const decodedImage = Buffer.from(image, "base64");
      const { data, info } = await sharp(decodedImage)
        .resize({ width: 512 })
        .toBuffer({ resolveWithObject: true });
      base64Avatar = data.toString("base64");
      avatarFilename = `${botName}.${info.format}`;
      formattedBotData.image = `./avatars/${botName}.${info.format}`;
    }

    const files: { [path: string]: string | File } = {
      [`_data/bots/${botName}.json`]: JSON.stringify(formattedBotData, null, 2),
    };
    if (image) {
      files[`_data/bots/avatars/${avatarFilename}`] = {
        content: base64Avatar,
        encoding: "base64",
      };
    }

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
    const title = `Register bot ${botName}`;
    const body = dedent`
    Registration for bot ${botName} submitted by ${username}.
    
    Description:
    ${description}

    ${gitHubUsername && "@" + gitHubUsername}
    `;

    // create file for bot account
    const registrationResponse = await octokit.createPullRequest({
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

    if (!registrationResponse) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to create pull request." }),
      };
    }

    // submit application entry
    const submissionBody = dedent`
    Bot registration PR: ${registrationResponse.data.html_url}

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
        labels: ["QA (Quality Assurance"],
      }
    );

    const issueId = issueResult.data.number;
    const issueUrl = issueResult.data.html_url;
    const message = `${botName} issue #${issueId}`;
    const path = `data/${botName}-${issueId}.json`;

    const fileData = {
      handle: botName,
      crew: crewMembers,
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

    const emails = await getGroupEmails(crewMembers);
    const emailSubject = `Application to register bot "${botName}" has been submitted`;
    const emailBody = dedent`
    An application to register a new bot (${botName}) has been received with the following crew: ${crewMembers.join(
      ", "
    )}
    
    You can see the PR here: ${registrationResponse.data.html_url}
    `;
    await sendConfirmationEmail(emails, emailSubject, emailBody);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Created PR ${registrationResponse.data.number}`,
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
