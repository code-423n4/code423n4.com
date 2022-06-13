const { createPullRequest } = require("octokit-plugin-create-pull-request");
const dedent = require("dedent");
const formData = require("form-data");
const Kickbox = require("kickbox");
const Mailgun = require("mailgun.js");
const { Moralis } = require("moralis/node");
const { Octokit } = require("@octokit/core");
const sharp = require("sharp");

const {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
  kickboxApiKey,
} = require("./_config");
const { resolve } = require("core-js/fn/promise");

const kickbox = Kickbox.client(kickboxApiKey).kickbox();

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: apiKey });

function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

function getPrData(isUpdate, handle, gitHubUsername, qualifications) {
  let sentenceVerb = "Register";

  if (isUpdate) {
    sentenceVerb = "Update";
  }

  const title = `${sentenceVerb} warden ${handle}`;
  const branchName = `warden/${handle}`;
  const body = isUpdate
    ? dedent`
      This auto-generated PR updates info for warden ${handle}

      @${gitHubUsername}
    `
    : dedent`
        Auto-generated PR to register the new warden ${handle}

        @${gitHubUsername}
        
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

    const owner = process.env.GITHUB_OWNER;
    const data = JSON.parse(event.body);
    const {
      handle,
      qualifications,
      image,
      link,
      moralisId,
      gitHubUsername,
      emailAddress,
      polygonAddress,
      isUpdate,
    } = data;

    // ensure we have the data we need
    if (!handle) {
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

    if (!emailAddress) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Email address is required" }),
      };
    }

    if (!qualifications && !isUpdate) {
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

    if (!polygonAddress) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Address is required",
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

    const kickboxPromise = new Promise((resolve, reject) => {
      kickbox.verify(emailAddress, async function (err, kickboxResponse) {
        // @todo: determine which results we should reject
        if (kickboxResponse.body.result === "undeliverable") {
          reject(kickboxResponse.body.message || "");
        }
        resolve();
      });
    });
    try {
      await kickboxPromise;
    } catch (error) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "The email address you entered is not valid. " + error,
        }),
      };
    }

    const url = `${event.headers.origin}/.netlify/functions/get-user?id=${handle}`;
    // make sure that an update has a valid warden file, and a new registration does not
    const response = await fetch(url);
    if (isUpdate && !response.ok) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Account does not exist" }),
      };
    }
    const userData = await response.json();
    if ((!isUpdate && response.ok) || userData.moralisId) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "This user is already registered" }),
      };
    }

    await Moralis.start({
      serverUrl: moralisServerUrl,
      appId: moralisAppId,
    });

    try {
      await Moralis.Cloud.run("checkHandleAgainstPreviousSubmissions", {
        username: handle,
        moralisId,
        polygonAddress,
      });
    } catch (error) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

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
            owner,
            repo: process.env.REPO,
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

    const { title, body, branchName } = getPrData(
      isUpdate,
      handle,
      gitHubUsername,
      qualifications
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

      const labels = isUpdate ? ["re-registration"] : ["app-warden"];

      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
        {
          owner,
          repo: process.env.REPO,
          issue_number: res.data.number,
          labels,
        }
      );

      const emailBody = dedent`
        Your registration is being processed.

        You can monitor the pull request here: ${res.data.html_url}

        Once this pull request is merged, you can log in and compete in contests.
      `;

      const emailData = {
        from: process.env.EMAIL_SENDER,
        to: emailAddress,
        subject: `Registration pending for ${handle}`,
        text: emailBody,
      };

      return mg.messages
        .create(domain, emailData)
        .then(() => {
          return {
            statusCode: 201,
            body: JSON.stringify({
              message: `Created PR ${res.data.number} and sent confirmation email`,
            }),
          };
        })
        .catch((err) => {
          return {
            statusCode: err.status || 500,
            body: JSON.stringify({
              error:
                "Failed to send confirmation email. " + (err.message || err),
            }),
          };
        });
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
