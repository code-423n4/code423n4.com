const csv = require("csvtojson");
const dedent = require("dedent");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { Moralis } = require("moralis/node");
const { Octokit } = require("@octokit/core");

const {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
  moralisMasterKey,
} = require("./_config");

// Netlify lambda functions don't make it this easy to share code across multiple functions
// Thats why this function is repeated in each endpoint.
function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

const octokit = new Octokit({ auth: token });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: apiKey });

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
    email,
    address,
    handle,
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
    !email ||
    !handle ||
    !address ||
    !risk ||
    !title ||
    !body ||
    !labels ||
    !contest ||
    !sponsor ||
    !repo
  ) {
    return {
      statusCode: 422,
      body:
        "Email, handle, address, risk, title, body, and labels are required.",
    };
  }

  // @todo: add temporary exception for existing wardens who have yet to connect their wallets
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
      address,
      username: handle,
    });
    if (!confirmed) {
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message || "Internal server error",
    };
  }

  if (isDangerous(repo)) {
    return {
      statusCode: 400,
      body:
        "Repository can only contain alphanumeric characters [a-zA-Z0-9] and hyphens (-).",
    };
  }

  if (isDangerous(handle)) {
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

  const recipients = `${email}, submissions@code423n4.com`;
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
    const message = `${handle} issue #${issueId}`;
    const path = `data/${handle}-${issueId}.json`;

    const fileData = {
      contest,
      handle,
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
    if (email === "@@@") {
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
