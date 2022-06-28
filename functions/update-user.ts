const dedent = require("dedent");
const { Moralis } = require("moralis/node");
const fetch = require("node-fetch");
const { Octokit } = require("@octokit/core");
import { createPullRequest } from "octokit-plugin-create-pull-request";

const { token, moralisAppId, moralisServerUrl } = require("./_config");

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

//@ts-ignore
function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

function getPrData(username, newUsername, gitHubUsername) {
  const title = `Update warden username: ${username} => ${newUsername}`;
  const branchName = `warden/${newUsername}`;
  const body = dedent`
      This auto-generated PR updates the username for warden ${username}

      @${gitHubUsername}
    `;
  return { title, body, branchName };
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
    const { username, gitHubUsername, newUsername, polygonAddress } = data;

    // ensure we have the data we need
    if (!username) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Handle is required" }),
      };
    }

    if (!gitHubUsername) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "GitHub username is required" }),
      };
    }

    if (!polygonAddress) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Address is required",
        }),
      };
    }

    if (isDangerous(newUsername) || isDangerous(username)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Handle can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
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

    const userUrl = `${event.headers.origin}/.netlify/functions/get-user?id=${username}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Account does not exist" }),
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

    const owner = process.env.GITHUB_REPO_OWNER;

    const { moralisId, link, image } = userData;

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

    const newWardenFile = { link, moralisId, image, handle: newUsername };
    const files: Record<string, unknown> = {
      [`_data/handles/${newUsername}.json`]: JSON.stringify(
        newWardenFile,
        null,
        2
      ),
      [`_data/handles/${username}.json`]: null, // delete old file
    };

    const { title, body, branchName } = getPrData(
      username,
      newUsername,
      gitHubUsername
    );
    try {
      const res = await octokit.createPullRequest({
        owner,
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
        body: JSON.stringify({
          message: `Created PR ${res.data.number}.`,
        }),
      };
    } catch (error) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify({
          error: error.response.data.message.toString(),
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
