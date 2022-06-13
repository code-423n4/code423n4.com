const { Octokit } = require("@octokit/core");
const { token } = require("./_config");
const dedent = require("dedent");

const octokit = new Octokit({ auth: token });

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
        body: "All form fields are required",
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
        owner: process.env.GITHUB_OWNER,
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
