const { createPullRequest } = require("octokit-plugin-create-pull-request");
const dedent = require("dedent");
const formData = require("form-data");
const Kickbox = require("kickbox");
const Mailgun = require("mailgun.js");
const { Moralis } = require("moralis-v1/node");
const { Octokit } = require("@octokit/core");
const sharp = require("sharp");
const { verify } = require("hcaptcha");
const { resolve } = require("core-js/fn/promise");

import {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
  kickboxApiKey,
} from "../_config";
import { isDangerousHandle } from "../util/validation-utils";
import { UserFileData } from "../../types/user";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

function getPrData(isUpdate, handle, gitHubUsername) {
  let sentenceVerb = "Register";

  if (isUpdate) {
    sentenceVerb = "Update";
  }

  const title = `${sentenceVerb} warden ${handle}`;
  const branchName = `warden/${handle}`;
  const tag = gitHubUsername ? `@${gitHubUsername}` : "";
  const body = isUpdate
    ? dedent`
      This auto-generated PR updates info for warden ${handle}

      ${tag}
    `
    : dedent`
        Auto-generated PR to register the new warden ${handle}

        ${tag}
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

    if (!emailAddress) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "Email address is required" }),
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

    if (isDangerousHandle(handle)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Handle can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
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

    if (kickboxApiKey) {
      const kickbox = Kickbox.client(kickboxApiKey).kickbox();
      const kickboxPromise = new Promise((resolve, reject) => {
        kickbox.verify(emailAddress, async function (err, kickboxResponse) {
          // @todo: determine which results we should reject
          if (kickboxResponse.body.result === "undeliverable") {
            reject(kickboxResponse.body.message || "");
          }
          resolve(kickboxResponse.body.result);
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
    }

    const url = `${process.env.URL}/.netlify/functions/get-user?id=${handle}`;
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

    const formattedHandleData: UserFileData = { handle, link, moralisId };
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

    const files: Record<string, unknown> = {
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

    const owner = process.env.GITHUB_REPO_OWNER;
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
            // @ts-ignore // @todo: fix this typescript error
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
      gitHubUsername
    );
    try {
      const res = await octokit.createPullRequest({
        owner,
        repo: process.env.REPO,
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

      if (apiKey && domain) {
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: "api", key: apiKey });

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
      } else {
        return {
          statusCode: 201,
          body: JSON.stringify({
            message: `Created PR ${res.data.number}. Email confirmation skipped`,
          }),
        };
      }
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
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error.message || "Internal server error.",
      }),
    };
  }
};
