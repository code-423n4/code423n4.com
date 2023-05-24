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
      bio,
      link1,
      details1,
      link2,
      details2,
      link3,
      details3,
      experience,
      questions,
    } = data;

    const handle = event.headers["c4-user"];

    // ensure we have the data we need
    if (
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
        body: JSON.stringify({
          error: "Please check that you filled out all required form fields.",
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

    const userUrl = `${process.env.URL}/.netlify/functions/get-user?id=${handle}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "You must be a registered warden to apply to be a C4 contest lookout",
        }),
      };
    }

    const userData = await userResponse.json();
    if (!userData || !userData.moralisId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "You must be a registered warden to apply to be a C4 contest lookout",
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
    # Warden ${handle} wants to be a lookout

    ## Bio
    ${bio}

    ## Experience
    ${experience ? experience : "No experience provided."}

    ## Questions
    ${questions ? questions : "No questions provided."}

    ## Code4rena submission 1
    ${link1}
    ${details1}

    ## Code4rena submission 2
    ${link2}
    ${details2}

    ## Code4rena submission 3
    ${link3}
    ${details3}

    `;

    const createIssue = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: process.env.GITHUB_REPO_OWNER,
        repo: "lookouts",
        title: `Warden ${handle} has applied to be a lookout`,
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
