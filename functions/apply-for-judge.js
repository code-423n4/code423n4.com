const { Octokit } = require("@octokit/core");
const { token } = require("./_config");

const octokit = new Octokit({ auth: token });

exports.handler = async (event) => {
  console.log("event:", event);
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
    const { handle, details } = data;

    // ensure we have the data we need
    if (!handle || !details) {
      return {
        statusCode: 422,
        body: "Handle and details are required.",
      };
    }

    const createIssue = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: "code-423n4",
        repo: "judges",
        title: `[TEST PR; INVALID] Warden ${handle} has applied for judge`,
        body: `${details}`,
        labels: ["invalid"],
      }
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ createIssue }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
