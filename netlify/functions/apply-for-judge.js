const dedent = require("dedent");
const { Moralis } = require("moralis-v1/node");
const { Octokit } = require("@octokit/core");
const fetch = require("node-fetch");

const { token, moralisAppId, moralisServerUrl } = require("../_config");

const octokit = new Octokit({ auth: token });

exports.handler = async (event) => {
  // only allow POST
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
        headers: { Allow: "POST" },
      };
    }

    const data = JSON.parse(event.body);
    const {
      handle,
      bio,
      link1,
      details1,
      link2,
      details2,
      link3,
      details3,
    } = data;

    // ensure we have the data we need
    if (
      !handle ||
      !bio ||
      !link1 ||
      !details1 ||
      !link2 ||
      !details2 ||
      !link3 ||
      !details3
    ) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: "All form fields are required" }),
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

    const userUrl = `${process.env.URL}/.netlify/functions/get-user?id=${handle}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "You must be a registered warden to apply to be a C4 contest judge",
        }),
      };
    }

    const userData = await userResponse.json();
    if (!userData || !userData.moralisId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "You must be a registered warden to apply to be a C4 contest judge",
        }),
      };
    }

    const { moralisId } = userData;
    const sessionToken = authorization.split("Bearer ")[1];
    const confirmed = await Moralis.Cloud.run("confirmUser", {
      sessionToken,
      moralisId,
      username: handle,
    });
    if (!confirmed) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Authorization failed",
        }),
      };
    }

    // Stitch all those form fields together into one chunk for the body of the GitHub issue
    const details = dedent`
    # Warden ${handle} wants to be a judge

    ## Bio
    ${bio}

    ## High severity Code4rena submission 1
    ${link1}
    ${details1}

    ## High severity Code4rena submission 2
    ${link2}
    ${details2}

    ## High severity Code4rena submission 3
    ${link3}
    ${details3}

    `;

    const createIssue = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: process.env.GITHUB_REPO_OWNER,
        repo: "judges",
        title: `Warden ${handle} has applied to be a judge`,
        body: `${details}`,
        labels: ["candidate"],
      }
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ createIssue }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message || "Internal server error." }),
    };
  }
};
