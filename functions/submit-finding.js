const dedent = require("dedent");
const { Octokit } = require("@octokit/core");
const { token, apiKey, domain } = require("./_config");

const octokit = new Octokit({ auth: token });
const mg = require("mailgun-js")({ apiKey, domain });

function parseRepoUrl(repoUrl) {
  const u = new URL(repoUrl);
  const [, owner, repo] = u.pathname.split("/");
  return { owner, repo };
}

exports.handler = async (event) => {
  console.log("event", event);
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
    repoUrl,
  } = data;

  const { owner, repo } = parseRepoUrl(repoUrl);

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
    !repoUrl
  ) {
    return {
      statusCode: 422,
      body:
        "Email, handle, address, risk, title, body, and labels are required.",
    };
  }

  const recipients = `${email}, submissions@code423n4.com`;
  const text = dedent`
  C4 finding submitted:
  
  ${body}
  `;

  const emailData = {
    from: "submissions@code423n4.com",
    to: recipients,
    subject: `C4 ${sponsor} finding: ${title}`,
    text,
  };
  //
  //   try {
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

  const fileResult = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path,
      message,
      content,
    }
  );

  // Special email used for testing
  if (email === "@@@") {
    return {
      statusCode: 200,
      body: "Issue posted successfully and confirmation email sent.",
    };
  }

  return mg
    .messages()
    .send(emailData)
    .then(() => ({
      statusCode: 200,
      body: "Issue posted successfully and confirmation email sent.",
    }))
    .catch((error) => ({
      statusCode: 500,
      body: `Error: ${error}`,
    }));
};
