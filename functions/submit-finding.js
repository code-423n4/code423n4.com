const { createPullRequest } = require("octokit-plugin-create-pull-request");
const csv = require("csvtojson");
const dedent = require("dedent");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { Moralis } = require("moralis/node");
const { Octokit } = require("@octokit/core");
const fetch = require("node-fetch");

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

function isDangerousHandle(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

function isDangerousRepo(s) {
  return s.match(/^[0-9a-zA-Z\-]+$/) === null;
}

async function getContestEnd(contestId) {
  const contests = await csv().fromFile("_data/contests/contests.csv");

  const contest = contests.find((c) => c.contestid == contestId);
  return new Date(contest.end_time).getTime();
}

async function updateTeamData(team, newPolygonAddress) {
  // @todo: delete this once all existing teams have added addresses
  const updatedTeamData = JSON.stringify(
    {
      ...team,
      address: newPolygonAddress,
    },
    null,
    2
  );
  const files = {
    [`_data/handles/${teamName}.json`]: updatedTeamData,
  };
  const body = `This auto-generated PR adds polygon address for team ${teamName}`;
  const title = `Add address for team ${teamName}`;
  await octokit.createPullRequest({
    owner: "code-423n4",
    repo: "code423n4.com",
    title,
    body,
    head: `warden/${teamName}`,
    changes: [
      {
        files,
        commit: title,
      },
    ],
  });
}

exports.handler = async (event) => {
  // only allow POST
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
    user,
    emailAddresses,
    address,
    attributedTo,
    risk,
    title,
    body,
    labels,
    contest,
    sponsor,
    repo,
  } = data;

  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
    masterKey: moralisMasterKey,
  });

  const owner = "code-423n4";

  // ensure we have the data we need
  if (
    !emailAddresses ||
    emailAddresses.length < 1 ||
    !user ||
    !address ||
    !risk ||
    !title ||
    !body ||
    !labels ||
    !contest ||
    !sponsor ||
    !attributedTo ||
    !repo
  ) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error:
          "Email, handle, address, risk, title, body, and labels are required.",
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

  const isTeamSubmission = attributedTo !== user;

  try {
    const url = `${event.headers.origin}/.netlify/functions/get-user?id=${attributedTo}`;
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: 401,
        body: "You must be registered to submit findings",
      };
    }
    
    const isTeamSubmission = attributedTo !== user;
    const userData = await response.json();
    if ((!userData || !userData.moralisId) && !isTeamSubmission) {
      return {
        statusCode: 401,
        body: "You must be registered to submit findings",
      };
    }
  
    const { moralisId } = userData;
    const sessionToken = authorization.split("Bearer ")[1];
    const confirmed = await Moralis.Cloud.run("confirmUser", {
      sessionToken,
      moralisId,
      username: user,
    });
    if (!confirmed) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Authorization failed",
        }),
      };
    }
  
    if (isTeamSubmission) {
      if (!userData.members || !userData.members.includes(user)) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: "You cannot submit findings for a team you are not on",
          }),
        };
      }
      if (!team.address) {
        // create a PR to update team JSON file with team address
        try {
          await updateTeamData(team, address);
        } catch (error) {
          // don't throw error if this PR fails - there will likely be duplicates
          // due to the fact that PRs take some time to review and merge and we
          // don't want to block teams from submitting findings in the meantime
          console.error(error);
        }
      }
    }
  } catch (err) {
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({
        error: err.message || "Internal server error",
      }),
    };
  }

  if (isDangerousRepo(repo)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Repository can only contain alphanumeric characters [a-zA-Z0-9] and hyphens (-).",
      }),
    };
  }

  if (isDangerousHandle(user) || isDangerousHandle(attributedTo)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
      }),
    };
  }

  // make sure finding was submitted within the contest window, allowing 5 sec padding
  try {
    const contestEnd = await getContestEnd(contest);
    if (Date.now() - 5000 > contestEnd) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "This contest has ended.",
        }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Error fetching contest data",
      }),
    };
  }

  const recipients = `${emailAddresses.join(", ")}, submissions@code423n4.com`;
  const text = dedent`
  C4 finding submitted: (risk = ${labels[1]})
  Wallet address: ${address}
  
  ${body}
  `;

  const emailData = {
    from: "submissions@code423n4.com",
    to: recipients,
    subject: `C4 ${sponsor} finding: ${title}`,
    text,
  };

  try {
    const issueResult = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner,
        repo,
        title,
        body,
        labels,
      }
    );

    const issueId = issueResult.data.number;
    const issueUrl = issueResult.data.html_url;
    const message = `${attributedTo} issue #${issueId}`;
    const path = `data/${attributedTo}-${issueId}.json`;

    const fileData = {
      contest,
      handle: attributedTo,
      address,
      risk,
      title,
      issueId,
      issueUrl,
    };

    const content = Buffer.from(JSON.stringify(fileData, null, 2)).toString(
      "base64"
    );

    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message,
      content,
    });

    // Special email used for testing
    if (emailAddresses[0] === "@@@") {
      return {
        statusCode: 200,
        body: "Issue posted successfully and confirmation email sent.",
      };
    }

    return mg.messages
      .create(domain, emailData)
      .then(() => {
        return {
          statusCode: 200,
          body: "Issue posted successfully and confirmation email sent.",
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
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong with your submission. Please try again.",
      }),
    };
  }
};
