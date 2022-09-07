import fetch from "node-fetch";
import Moralis from "moralis/node";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
const sharp = require("sharp");
import { Octokit } from "@octokit/core";

import { token, moralisAppId, moralisServerUrl } from "../_config";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

exports.handler = async (event) => {
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
    const { teamName, username, image, link, members, address } = data;

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

    if (!address) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Polygon address is required",
        }),
      };
    }

    if (isDangerous(teamName)) {
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

    const authorization = event.headers["x-authorization"];
    if (!authorization) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }

    await Moralis.start({
      serverUrl: moralisServerUrl,
      appId: moralisAppId,
    });

    const userUrl = `${process.env.URL}/.netlify/functions/get-user?id=${username}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "You must be a registered warden to create a team",
        }),
      };
    }

    const userData = await userResponse.json();
    if (!userData || !userData.moralisId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "You must be a registered warden to create a team",
        }),
      };
    }

    const { moralisId } = userData;
    const sessionToken = authorization.split("Bearer ")[1];
    const confirmed = await Moralis.Cloud.run("confirmUser", {
      sessionToken,
      moralisId,
      username,
    });
    if (!confirmed) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Authorization failed",
        }),
      };
    }

    const formattedTeamData: {
      handle: string;
      members: string[];
      address: string;
      link?: string;
      image?: string;
    } = { handle: teamName, members, address, link };
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
