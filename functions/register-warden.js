const { Octokit } = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const sharp = require("sharp");
const { token } = require("./_config");
const dedent = require("dedent");

// Netlify lambda functions don't make it this easy to share code across multiple functions
// Thats why this function is repeated in each endpoint.
function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

function getPrData(isUpdate, handle) {
  let sentenceVerb = "Register";

  if (isUpdate) {
    sentenceVerb = "Update";
  }

  const title = `${sentenceVerb} warden ${handle}`;
  const branchName = `warden/${handle}`;
  const body = isUpdate
    ? `This auto-generated PR updates info for warden ${handle}`
    : dedent`
        Auto-generated PR to register the new warden ${handle}
        
        ${qualifications}
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
    const { handle, qualifications, image, link, moralisId, isUpdate } = data;

    // ensure we have the data we need
    if (!handle) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Handle is required" }),
      };
    }

    if (!qualifications) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error:
            "Please provide evidence of your ability to compete in an EVM-base audit contest",
        }),
      };
    }

    if (!moralisId) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Moralis id is required",
        }),
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

    // @todo: prevent registering wardens who have already connected their wallets

    const formattedHandleData = { handle, link, moralisId };
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

    // @todo: delete this once all existing users have completed registration
    if (isUpdate) {
      try {
        const wardenFile = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: "code-423n4",
            repo: "code423n4.com",
            path: `_data/handles/${handle}.json`,
          }
        );

        const content = JSON.stringify(
          {
            ...JSON.parse(Buffer.from(wardenFile.data.content, "base64")),
            moralisId,
          },
          null,
          2
        );
        files[`_data/handles/${handle}.json`] = content;
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal server error." }),
        };
      }
    }

    const { title, body, branchName } = getPrData(isUpdate, handle);
    try {
      const res = await octokit.createPullRequest({
        owner: "code-423n4",
        repo: "code423n4.com",
        title,
        body,
        head: branchName,
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
