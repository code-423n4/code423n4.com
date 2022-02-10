const dedent = require("dedent");
const { Octokit } = require("@octokit/core");
const { token, apiKey, domain } = require("./_config");

const octokit = new Octokit({ auth: token });
const mg = require("mailgun-js")({ apiKey, domain });

function isDangerousHandle(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

function isDangerousRepo(s) {
  return s.match(/^[0-9a-zA-Z\-]+$/) === null;
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
    repo
  } = data;

  const owner = 'code-423n4';

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

  if (isDangerousRepo(repo)) {
    return {
      statusCode: 400,
      body:
        "Repository can only contain alphanumeric characters [a-zA-Z0-9] and hyphens (-).",
    };
  }

  if (isDangerousHandle(handle)) {
    return {
      statusCode: 400,
      body:
        "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
    };
  }

  const recipients = `${email}, submissions@code423n4.com`;
  const text = dedent`
  C4 finding submitted: (risk = ${labels[1]})
  
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

    await octokit.request(
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
  } catch (error) {
    return {
      statusCode: 500,
      body:
        "Something went wrong with your submission. Please try again.",
    };
  }
};
