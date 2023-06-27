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
  TeamData,
  TeamDeleteRequest,
  TeamUpdateRequest,
} from "../../types/user";
import { checkAuth, checkTeamAuth } from "../util/auth-utils";
import { getGroupEmails, sendConfirmationEmail } from "../util/user-utils";

const OctokitClient = Octokit.plugin(createPullRequest, createOrUpdateTextFile);
const octokit = new OctokitClient({ auth: token });

async function editTeam(
  data: TeamUpdateRequest,
  username: string,
  sessionToken: string
): Promise<Response> {
  const {
    teamName,
    image,
    link,
    members,
    polygonAddress,
    ethereumAddress,
  }: TeamUpdateRequest = data;

  if (!teamName) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Team name is required",
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

  if (!members || !members.newValue || members.newValue.length < 2) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Teams must have at least 2 members",
      }),
    };
  }

  let oldTeamData;
  try {
    oldTeamData = await checkTeamAuth(teamName, username);
    delete oldTeamData.imageUrl;
  } catch (error) {
    return {
      statusCode: error.status,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const paymentAddresses = [
    { chain: "polygon", address: polygonAddress.newValue },
  ];
  if (ethereumAddress && ethereumAddress.newValue) {
    paymentAddresses.push({
      chain: "ethereum",
      address: ethereumAddress.newValue,
    });
  }

  const newTeamData: TeamData = {
    ...oldTeamData,
    members: members.newValue,
    paymentAddresses,
  };

  if (link && link.newValue) {
    newTeamData.link = link.newValue;
  } else {
    delete newTeamData.link;
  }

  let avatarFilename = "";
  let base64Avatar = "";
  if (image) {
    const decodedImage = Buffer.from(image, "base64");
    const { data, info } = await sharp(decodedImage)
      .resize({ width: 512 })
      .toBuffer({ resolveWithObject: true });
    base64Avatar = data.toString("base64");
    avatarFilename = `${teamName}.${info.format}`;
    newTeamData.image = `./avatars/${teamName}.${info.format}`;
  }

  // Don't create a PR if the json content and image have not changed
  if (isEqual(newTeamData, oldTeamData) && !image) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: "Nothing changed" }),
    };
  }

  const files: { [path: string]: string | File } = {
    [`_data/handles/${teamName}.json`]: JSON.stringify(newTeamData, null, 2),
  };
  if (image) {
    files[`_data/handles/avatars/${avatarFilename}`] = {
      content: base64Avatar,
      encoding: "base64",
    };
  }

  const title = `Edit team ${teamName}`;
  const body = dedent`
  This auto-generated PR modifies the team ${teamName}

  The request was made by ${username}
  `;
  const branchName = `team/${teamName}`;

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
        subject: "Team Update",
        request: "team",
        description: `PR link: ${res.data.html_url}`,
        discordHandle: username,
      }),
    });

    const newMemberEmails = await getGroupEmails(newTeamData.members);
    const oldMemberEmails = await getGroupEmails(oldTeamData.members);
    const emailSubject = `Code4rena team "${teamName}" has been modified`;

    const emailBody = dedent`
      Changes to the team ${teamName} have been requested.

      Members: ${members.newValue.join(", ")}

      Polygon address: ${polygonAddress.newValue}
      ${
        ethereumAddress &&
        (ethereumAddress.newValue || ethereumAddress.oldValue)
          ? "Ethereum address: " + ethereumAddress.newValue
          : ""
      }
      ${
        link && (link.newValue || link.oldValue) ? "Link: " + link.newValue : ""
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

async function deleteTeam(
  data: TeamDeleteRequest,
  username: string,
  sessionToken: string
): Promise<Response> {
  const { name } = data;
  if (!name) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Team name is required",
      }),
    };
  }
  const team = await checkTeamAuth(name, username);

  const title = `Delete team ${name}`;
  const body = `This auto-generated PR removes the team ${name}`;
  const branchName = `team/${name}`;

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
    path: `_data/handles/${name}.json`,
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

  if (team.image) {
    await octokit.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: process.env.REPO!,
      path: `_data/handles${team.image.slice(1)}`,
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
      subject: "Delete Team",
      request: "team",
      description: `PR link: ${res.data.html_url}`,
      discordHandle: username,
    }),
  });

  const teamEmails = await getGroupEmails(team.members);
  const emailSubject = `Code4rena team "${name}" has been deleted`;
  const emailBody = dedent`
  Team ${name} deleted by ${username}

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
        return await editTeam(data, username, sessionToken);
      case "DELETE":
        return await deleteTeam(data, username, sessionToken);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({
            error: "You can only edit or delete a team from this endpoint",
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
