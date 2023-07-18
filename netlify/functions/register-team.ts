import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
const sharp = require("sharp");
import { Octokit } from "@octokit/core";

import { token } from "../_config";
import { TeamData } from "../../types/user";
import { getGroupEmails, sendConfirmationEmail } from "../util/user-utils";
import { checkAuth } from "../util/auth-utils";
import { isDangerousHandle } from "../util/validation-utils";

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

    const data = JSON.parse(event.body);
    const {
      teamName,
      image,
      link,
      members,
      polygonAddress,
      ethereumAddress,
    } = data;
    const username = event.headers["c4-user"];
    const authorization = event.headers["x-authorization"];

    // ensure we have the data we need
    if (!teamName) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Team name is required",
        }),
      };
    }

    if (teamName.length > 25) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Team name's length is limited to 25 characters.",
        }),
      };
    }

    if (!polygonAddress) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Polygon address is required",
        }),
      };
    }

    if (isDangerousHandle(teamName)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Team name can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    if (!members || members.length < 2) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Teams must have at least 2 members",
        }),
      };
    }

    if (!members.includes(username)) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Team must include the user who created the team",
        }),
      };
    }

    const sessionToken = authorization.split("Bearer ")[1];

    const paymentAddresses = [{ chain: "polygon", address: polygonAddress }];
    if (ethereumAddress) {
      paymentAddresses.push({ chain: "ethereum", address: ethereumAddress });
    }

    const formattedTeamData: TeamData = {
      handle: teamName,
      members,
      link,
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
      avatarFilename = `${teamName}.${info.format}`;
      formattedTeamData.image = `./avatars/${teamName}.${info.format}`;
    }

    const files: { [path: string]: string | File } = {
      [`_data/handles/${teamName}.json`]: JSON.stringify(
        formattedTeamData,
        null,
        2
      ),
    };
    if (image) {
      files[`_data/handles/avatars/${avatarFilename}`] = {
        content: base64Avatar,
        encoding: "base64",
      };
    }

    const title = `Create team ${teamName}`;
    const body = `This auto-generated PR creates the team ${teamName}`;
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
          subject: "New team request",
          request: "team",
          description: `PR link: ${res.data.html_url}`,
          discordHandle: username,
        }),
      });

      const emails = await getGroupEmails(formattedTeamData.members);
      const emailSubject = `Code4rena team "${teamName}" has been created`;
      const emailBody = `A new Code4rena team (${teamName}) has been created with members: \n\n${members.join(
        ", "
      )}. \n\nYou can see the PR here: ${res.data.html_url}`;
      await sendConfirmationEmail(emails, emailSubject, emailBody);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: `Created PR ${res.data.number}` }),
      };
    } catch (error) {
      return {
        statusCode: error?.response?.status || 500,
        body: JSON.stringify({
          error:
            "" + error?.response?.data?.message || "Internal server error.",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
