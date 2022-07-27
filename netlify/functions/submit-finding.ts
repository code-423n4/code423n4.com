const { createPullRequest } = require("octokit-plugin-create-pull-request");
const csv = require("csvtojson");
const dedent = require("dedent");
const fetch = require("node-fetch");
const { Moralis } = require("moralis/node");
const { Octokit } = require("@octokit/core");

const {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
} = require("../_config");
import {
  checkAndUpdateTeamAddress,
  sendConfirmationEmail,
} from "../util/user-utils";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

function isDangerousHandle(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

function isDangerousRepo(s) {
  return s.match(/^[0-9a-zA-Z\-]+$/) === null;
}

async function getContestEnd(contestId) {
  let contests;
  if (process.env.NODE_ENV === "development") {
    contests = await csv().fromFile("_test-data/contests/contests.csv");
  } else {
    contests = await csv().fromFile("_data/contests/contests.csv");
  }

  const contest = contests.find((c) => c.contestid == contestId);
  return new Date(contest.end_time).getTime();
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
  let { emailAddresses } = data;

  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
  });

  // filter & sanitize mails
  emailAddresses = (emailAddresses || [])
    .map((e) => e.toLowerCase().trim())
    .filter((e) => /\S+@\S+\.\S+/.test(e));
  // remove duplicates
  emailAddresses = [...new Set(emailAddresses)];

  // @dev add check for max mail limit
  const MAX_MAIL_LIMIT = 80;
  if (emailAddresses.length > MAX_MAIL_LIMIT) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: `Reduce emails recipients to a maximum of ${MAX_MAIL_LIMIT}.`,
      }),
    };
  }

  // ensure we have the data we need
  if (
    emailAddresses.length == 0 ||
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

  try {
    const userUrl = `${process.env.URL}/.netlify/functions/get-user?id=${user}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "You must be registered to submit findings",
        }),
      };
    }

    const userData = await userResponse.json();
    if (!userData || !userData.moralisId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "You must be registered to submit findings",
        }),
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

    await checkAndUpdateTeamAddress(attributedTo, user, address);
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error.message || "Internal server error",
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

  const owner = process.env.GITHUB_CONTEST_REPO_OWNER;

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
      risk: risk.slice(0, 1),
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

    if (apiKey && domain && process.env.EMAIL_SENDER) {
      const text = dedent`
      C4 finding submitted: (risk = ${risk})
      Wallet address: ${address}
      
      ${body}
      `;
      const subject = `C4 ${sponsor} finding: ${title}`;

      await sendConfirmationEmail(emailAddresses, subject, text);
      return {
        statusCode: 200,
        body: "Issue posted successfully and confirmation email sent.",
      };
    } else {
      return {
        statusCode: 200,
        body: "Issue posted successfully. Confirmation email skipped",
      };
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error:
          error.message ||
          "Something went wrong with your submission. Please try again.",
      }),
    };
  }
};
