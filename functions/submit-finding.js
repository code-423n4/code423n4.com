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

const octokit = new Octokit({ auth: token });

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

exports.handler = async (event) => {
  // only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed",
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
    !emailAddresses.length > 0 ||
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
      body:
        "Email, handle, address, risk, title, body, and labels are required.",
    };
  }

  const authorization = event.headers["x-authorization"];
  if (!authorization) {
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }

  try {
    const sessionToken = authorization.split("Bearer ")[1];
    const confirmed = await Moralis.Cloud.run("confirmUser", {
      sessionToken,
      username: user,
    });
    if (!confirmed) {
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }
    if (attributedTo !== user) {
      const url = `${event.headers.origin}/.netlify/functions/getUser?id=${attributedTo}`;
      const response = await fetch(url);
      if (!response.ok) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }
      const team = await response.json();
      if (!team || !team.members || !team.members.includes(user)) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message || "Internal server error",
    };
  }

  if (isDangerousRepo(repo)) {
    return {
      statusCode: 400,
      body:
        "Repository can only contain alphanumeric characters [a-zA-Z0-9] and hyphens (-).",
    };
  }

  if (isDangerousHandle(user) || isDangerousHandle(attributedTo)) {
    return {
      statusCode: 400,
      body:
        "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
    };
  }

  // make sure finding was submitted within the contest window, allowing 5 sec padding
  try {
    const contestEnd = await getContestEnd(contest);
    if (Date.now() - 5000 > contestEnd) {
      return {
        statusCode: 400,
        body: "This contest has ended.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 422,
      body: "Error fetching contest data",
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
      body: "Something went wrong with your submission. Please try again.",
    };
  }
};
