const { createPullRequest } = require("octokit-plugin-create-pull-request");
const dedent = require("dedent");
const formData = require("form-data");
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
  moralisMasterKey,
} = require("./_config");

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

    if (isDangerous(handle)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Handle can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    const url = `${event.headers.origin}/.netlify/functions/get-user?id=${handle}`;
    // make sure that an update has a valid warden file, and a new registration does not
    const response = await fetch(url);
    if (isUpdate && !response.ok) {
      return {
        statusCode: 422,
        body: "Account does not exist",
      };
    }
    const userData = await response.json();
    if ((!isUpdate && response.ok) || userData.moralisId) {
      return {
        statusCode: 422,
        body: "This user is already registered",
      };
    }

    await Moralis.start({
      serverUrl: moralisServerUrl,
      appId: moralisAppId,
      masterKey: moralisMasterKey,
    });

    try {
      const isValidUser = await Moralis.Cloud.run(
        "checkHandleAgainstPreviousSubmissions",
        {
          username: handle,
          moralisId,
          polygonAddress,
        }
      );
      if (!isValidUser) {
        return {
          statusCode: 422,
          body: "Unauthorized",
        };
      }
    } catch (error) {
      return {
        statusCode: 422,
        body: "Unauthorized",
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

    const { title, body, branchName } = getPrData(
      isUpdate,
      handle,
      gitHubUsername,
      qualifications
    );
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
      
       await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/labels", {
        owner: "code-423n4",
        repo: "code423n4.com",
        issue_number: res.data.number,
        labels: [
          "app-warden",
        ]
      });

      const emailBody = dedent`
        Your registration is being processed.

        You can monitor the pull request here: ${res.url}

        Once this pull request is merged, you can log in and compete in contests.
      `;

      const emailData = {
        from: "submissions@code423n4.com",
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
            body: JSON.stringify({ error: err.message || err }),
          };
        });
    } catch (error) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify({ error: error.response.data.message.toString() }),
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
