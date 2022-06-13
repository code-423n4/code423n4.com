const { createPullRequest } = require("octokit-plugin-create-pull-request");
const { Octokit } = require("@octokit/core");
const sharp = require("sharp");
const { token } = require("./_config");

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
    const { teamName, image, link, members, address } = data;

    // ensure we have the data we need
    if (!teamName) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Team name is required",
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

    const files: Record<string, unknown> = {
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
        owner: process.env.GITHUB_REPO_OWNER,
        repo: process.env.REPO,
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
