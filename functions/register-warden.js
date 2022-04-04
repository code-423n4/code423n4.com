const { Octokit } = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const sharp = require("sharp");
const { verify } = require("hcaptcha");
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
        body: "Method not allowed",
        headers: { Allow: "POST" },
      };
    }

    const data = JSON.parse(event.body);
    let { handle, image, link } = data;

    // ensure we have the data we need
    if (!handle) {
      return {
        statusCode: 422,
        body: "Handle is required",
      };
    }

    if (isDangerous(handle)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Handle can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    let formattedHandleData = { handle, link };
    let avatarFilename = "";
    let base64Avatar = "";
    if (image) {
      const decodedImage = Buffer.from(image, "base64");
      const { data, info } = await sharp(decodedImage)
        .resize({ width: 512 })
        .toBuffer({ resolveWithObject: true });
      base64Avatar = data.toString("base64");
      avatarFilename = `${handle}.${info.format}`;
      formattedHandleData.image = `./avatars/${handle}.${info.format}`;
    }

    const files = {
      [`_data/handles/${handle}.json`]: JSON.stringify(
        formattedHandleData,
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

    try {
      const res = await octokit.createPullRequest({
        owner: "code-423n4",
        repo: "code423n4.com",
        title: `Add warden ${handle}`,
        body: `This auto-generated PR registers the new warden ${handle}`,
        head: `warden-${handle}`,
        changes: [
          {
            files,
            commit: `Add warden ${handle}`,
          },
        ],
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ message: `Created PR ${res.data.number}` }),
      };
    } catch (err) {
      return {
        statusCode: err.response.status,
        body: JSON.stringify({ error: err.response.data.message.toString() }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
