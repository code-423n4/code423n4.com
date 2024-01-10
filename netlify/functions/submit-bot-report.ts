import { Octokit } from "@octokit/core";
import dedent from "dedent";
import { createPullRequest } from "octokit-plugin-create-pull-request";

import { token } from "../_config";

import { BotReportCreateRequest } from "../../types/finding";
import { BotData } from "../../types/user";

import { checkAuth, checkBotAuth } from "../util/auth-utils";
import { getContest, isBotRaceActive } from "../util/contest-utils";
import { getGroupEmails, sendConfirmationEmail } from "../util/user-utils";

exports.handler = async (event) => {
  if (!(await checkAuth(event))) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  const data: BotReportCreateRequest = JSON.parse(event.body);
  const { botName, contest, body } = data;
  const username = event.headers["c4-user"];

  let bot: BotData;
  try {
    bot = await checkBotAuth(botName, username);
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  const currentContest = await getContest(contest);
  if (!currentContest) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Contest not found",
      }),
    };
  }

  // @todo: add bot findings repo to contest data
  const repo =
    currentContest.findingsRepo
      .replace("-findings", "-bot-findings")
      .split("/")
      .pop() || "";

  // make sure finding was submitted within the bot race window
  if (!isBotRaceActive(currentContest)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "The bot race has ended.",
      }),
    };
  }

  const OctokitClient = Octokit.plugin(createPullRequest);
  const octokit = new OctokitClient({ auth: token });
  const owner = process.env.GITHUB_REPO_OWNER!;

  try {
    const issueResult = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner,
        repo,
        title: `${botName} Bot Race submission`,
        body:
          `See the markdown file with the details of this report ` +
          `[here](https://github.com/${owner}/${repo}/blob/main/data/${botName}-report.md).`,
        labels: ["QA (Quality Assurance)"],
      }
    );

    const issueId = issueResult.data.number;
    const issueUrl = issueResult.data.html_url;
    const message = `${botName} issue #${issueId}`;
    const path = `data/${botName}-${issueId}.json`;

    const fileData = {
      handle: botName,
      crew: bot.crew,
      issueId,
      issueUrl,
    };

    const content = Buffer.from(JSON.stringify(fileData, null, 2)).toString(
      "base64"
    );

    // add data file for application entry
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message,
      content,
    });

    // add markdown file for submission
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: `data/${botName}-report.md`,
      message: `${botName} data for issue #${issueId}`,
      content: Buffer.from(body).toString("base64"),
    });

    const emails = await getGroupEmails(bot.crew);
    const emailSubject =
      `${botName} Bot Race report for ${currentContest.title} ` +
      `competition has been submitted`;
    const emailBody = dedent`
      ${botName} Bot Race Report:

      ${body}
    `;
    await sendConfirmationEmail(emails, emailSubject, emailBody);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Issue posted successfully and confirmation email sent.",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error?.message || "Something went wrong",
      }),
    };
  }
};
