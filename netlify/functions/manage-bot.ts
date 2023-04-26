import dedent from "dedent";
import isEqual from "lodash/isEqual";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
const sharp = require("sharp");
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";
import fetch from "node-fetch";

import { token } from "../_config";
import {
  BotData,
  BotDeleteRequest,
  BotUpdateRequest,
  PaymentAddress,
} from "../../types/user";
import { checkAuth, checkBotAuth } from "../util/auth-utils";
import { getGroupEmails, sendConfirmationEmail } from "../util/user-utils";

const OctokitClient = Octokit.plugin(createPullRequest, createOrUpdateTextFile);
const octokit = new OctokitClient({ auth: token });

async function editBot(
  data: BotUpdateRequest,
  username: string,
  sessionToken: string
): Promise<Response> {
  const {
    botName,
    image,
    crew,
    polygonAddress,
    ethereumAddress,
    relegated,
  }: BotUpdateRequest = data;

  if (!botName) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Bot name is required",
      }),
    };
  }

  if (!polygonAddress || !polygonAddress.newValue) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Polygon address is required",
      }),
    };
  }

  if (!crew || !crew.newValue || crew.newValue.length < 1) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Bot crew must have at least 1 member",
      }),
    };
  }

  let oldBotData: BotData;
  try {
    oldBotData = await checkBotAuth(botName, username);
    delete oldBotData.imageUrl;
  } catch (error) {
    return {
      statusCode: error.status,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const paymentAddresses: PaymentAddress[] = [
    { chain: "polygon", address: polygonAddress.newValue },
  ];
  if (ethereumAddress && ethereumAddress.newValue) {
    paymentAddresses.push({
      chain: "ethereum",
      address: ethereumAddress.newValue,
    });
  }

  const newBotData: BotData = {
    ...oldBotData,
    crew: crew.newValue,
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
    newBotData.image = `./avatars/${botName}.${info.format}`;
  }

  if (relegated?.newValue !== undefined) {
    newBotData.relegated = relegated.newValue;
  }

  // Don't create a PR if the json content and image have not changed
  if (isEqual(newBotData, oldBotData) && !image) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: "Nothing changed" }),
    };
  }

  const files: { [path: string]: string | File } = {
    [`_data/bots/${botName}.json`]: JSON.stringify(newBotData, null, 2),
  };
  if (image) {
    files[`_data/bots/avatars/${avatarFilename}`] = {
      content: base64Avatar,
      encoding: "base64",
    };
  }

  const title = `Edit bot ${botName}`;
  const body = dedent`
  This auto-generated PR modifies the bot ${botName}

  The request was made by ${username}
  `;
  const branchName = `bot/${botName}`;

  try {
    const res = await octokit.createPullRequest({
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

    if (!res) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to create pull request." }),
      };
    }

    // submit helpdesk ticket
    await fetch(`${process.env.URL}/.netlify/functions/request-support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
        "C4-User": username,
      },
      body: JSON.stringify({
        subject: "Bot Update",
        request: "team",
        description: `PR link: ${res.data.html_url}`,
        discordHandle: username,
      }),
    });

    const newMemberEmails = await getGroupEmails(newBotData.crew);
    const oldMemberEmails = await getGroupEmails(oldBotData.crew);
    const emailSubject = `Code4rena team "${botName}" has been modified`;

    const emailBody = dedent`
      Changes to the team ${botName} have been requested.

      Members: ${crew.newValue.join(", ")}

      Polygon address: ${polygonAddress.newValue}
      ${
        ethereumAddress &&
        (ethereumAddress.newValue || ethereumAddress.oldValue)
          ? "Ethereum address: " + ethereumAddress.newValue
          : ""
      }

      You can see the PR here: ${res.data.html_url}
    `;
    await sendConfirmationEmail(
      [...newMemberEmails, ...oldMemberEmails],
      emailSubject,
      emailBody
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ message: `Created PR ${res.data.number}` }),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ error: error.response.data.message.toString() }),
    };
  }
}

async function deleteBot(
  data: BotDeleteRequest,
  username: string,
  sessionToken: string
): Promise<Response> {
  const { name: botName } = data;
  if (!botName) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Bot name is required",
      }),
    };
  }
  const bot: BotData = await checkBotAuth(botName, username);

  const title = `Delete bot ${botName}`;
  const body = `This auto-generated PR removes the bot ${botName}`;
  const branchName = `bot/${botName}`;

  const res = await octokit.createPullRequest({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: process.env.REPO!,
    title,
    body,
    head: branchName,
    base: process.env.BRANCH_NAME,
    changes: {
      emptyCommit: true,
      commit: title,
    },
  });

  if (!res) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Failed to create pull request." }),
    };
  }

  const removedFile = await octokit.createOrUpdateTextFile({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: process.env.REPO!,
    path: `_data/bots/${botName}.json`,
    content: null,
    message: `File deleted by ${username}`,
    branch: branchName,
  });

  if (!removedFile.deleted) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Problem deleting old file" }),
    };
  }

  if (bot.image) {
    await octokit.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: process.env.REPO!,
      path: `_data/bots${bot.image.slice(1)}`,
      content: null,
      message: `File deleted by ${username}`,
      branch: branchName,
    });
  }

  // submit helpdesk ticket
  await fetch(`${process.env.URL}/.netlify/functions/request-support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": `Bearer ${sessionToken}`,
      "C4-User": username,
    },
    body: JSON.stringify({
      subject: "Delete Bot",
      request: "team",
      description: `PR link: ${res.data.html_url}`,
      discordHandle: username,
    }),
  });

  const teamEmails = await getGroupEmails(bot.crew);
  const emailSubject = `Code4rena bot "${botName}" has been deleted`;
  const emailBody = dedent`
  Bot ${botName} deleted by ${username}

  You can see the PR here: ${res.data.html_url}
  `;
  await sendConfirmationEmail(teamEmails, emailSubject, emailBody);
  return {
    statusCode: 201,
    body: JSON.stringify({ message: `Created PR ${res.data.number}` }),
  };
}

exports.handler = async (event: Event): Promise<Response> => {
  const data = JSON.parse(event.body!);
  const username = event.headers["c4-user"];
  if (!username) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Username is required",
      }),
    };
  }

  try {
    if (!(await checkAuth(event))) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  const authorization = event.headers["x-authorization"];
  const sessionToken = authorization!.split("Bearer ")[1];

  try {
    switch (event.httpMethod) {
      case "POST":
        return await editBot(data, username, sessionToken);
      case "DELETE":
        return await deleteBot(data, username, sessionToken);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({
            error: "You can only edit or delete a bot from this endpoint",
          }),
        };
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error.message || "Internal server error.",
      }),
    };
  }
};
