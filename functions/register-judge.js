const { Octokit } = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const sharp = require("sharp");
const { verify } = require("hcaptcha");
const { token } = require("./_config");

const { isDangerous } = require("./_utils");

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

exports.handler = async (event) => {
  console.log("event", event);
  // only allow POST
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method not allowed",
        headers: { Allow: "POST" },
      };
    }

    const { authorization } = event.headers;
    if (!authorization) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authorization failed" }),
      };
    }
    const { success } = await verify(
      process.env.HCAPTCHA_SECRET,
      authorization
    );
    if (!success) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authorization failed" }),
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

    console.log({ files });

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
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
