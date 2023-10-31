const { createPullRequest } = require("octokit-plugin-create-pull-request");
const dedent = require("dedent");
const fetch = require("node-fetch");
const { Moralis } = require("moralis-v1/node");
const { Octokit } = require("@octokit/core");

const {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
} = require("../_config");

import { TeamData } from "../../types/user";

import { checkTeamAuth } from "../util/auth-utils";
import {
  getContest,
  getRiskCodeFromGithubLabel,
  isContestActive,
} from "../util/contest-utils";
import { getMarkdownReportForUser } from "../util/github-utils";
import {
  updateTeamAddresses,
  sendConfirmationEmail,
  getGroupEmails,
} from "../util/user-utils";
import { isDangerousHandle } from "../util/validation-utils";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

function isDangerousRepo(s) {
  return s.match(/^[0-9a-zA-Z\-]+$/) === null;
}

exports.handler = async (event) => {
  // @todo for Mitigation Review:
  // extract relevant info from submission title and risk for mitigation reviews
  // add proper labels to new issue

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
    attributedTo,
    risk,
    title,
    body,
    labels,
    contest,
    sponsor,
    repo,
    address,
    mitigationOf,
  } = data;
  let emailAddresses: string[] = data.emailAddresses;
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
  const isMitigationReport: boolean = mitigationOf ? true : false;

  // ensure we have the data we need
  if (
    emailAddresses.length == 0 ||
    !user ||
    (!isMitigationReport && !risk) ||
    !title ||
    !body ||
    !labels ||
    !contest ||
    !sponsor ||
    (!isMitigationReport && !attributedTo) ||
    !repo
  ) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Email, handle, risk, title, body, and labels are required.",
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

    if (attributedTo !== user) {
      const team: TeamData = await checkTeamAuth(attributedTo, user);
      const teamEmailAddresses = await getGroupEmails(team.members);
      emailAddresses = emailAddresses.concat(teamEmailAddresses);
      const teamPolygonAddress =
        team.paymentAddresses &&
        team.paymentAddresses.find((address) => address.chain === "polygon");
      if (!teamPolygonAddress) {
        if (!address) {
          return {
            statusCode: 422,
            body: JSON.stringify({
              error:
                "Your team does not currently have a polygon address saved. You must include a polygon address with your submission.",
            }),
          };
        }
        try {
          const teamPaymentAddresses = team.paymentAddresses || [];
          teamPaymentAddresses.push({
            chain: "polygon",
            address,
          });
          await updateTeamAddresses(user, team, teamPaymentAddresses);
        } catch (error) {
          // don't throw error if this PR fails - there will likely be duplicates
          // due to the fact that PRs take some time to review and merge and we
          // don't want to block teams from submitting findings in the meantime
          console.warn(error);
        }
      }
    }
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

  try {
    const currentContest = await getContest(contest);
    if (!currentContest) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Contest not found",
        }),
      };
    }
    // make sure finding was submitted within the contest window
    if (!isContestActive(currentContest)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "This contest has ended.",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Error fetching contest data",
      }),
    };
  }

  const owner = process.env.GITHUB_CONTEST_REPO_OWNER;

  try {
    let isQaOrGasSubmission = false;
    let qaOrGasSubmissionBody = "";
    let markdownPath = "";
    const riskCode = getRiskCodeFromGithubLabel(risk);
    if (!isMitigationReport) {
      markdownPath = `data/${attributedTo}-${riskCode}.md`;
      qaOrGasSubmissionBody = `See the markdown file with the details of this report [here](https://github.com/${owner}/${repo}/blob/main/${markdownPath}).`;
      isQaOrGasSubmission = Boolean(riskCode === "G" || riskCode === "Q");
      if (isQaOrGasSubmission) {
        const existingReport = await getMarkdownReportForUser(
          octokit,
          repo,
          attributedTo,
          riskCode as "Q" | "G"
        );
        if (existingReport) {
          throw {
            status: 400,
            message: `It looks like you've already submitted a ${risk} report for this contest.`,
          };
        }
      }
    }

    const issueResult = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner,
        repo,
        title,
        body: isQaOrGasSubmission ? qaOrGasSubmissionBody : body,
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
      risk: riskCode,
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

    if (isQaOrGasSubmission) {
      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: markdownPath,
        message: `${attributedTo} data for issue #${issueId}`,
        content: Buffer.from(body).toString("base64"),
      });
    }

    if (apiKey && domain && process.env.EMAIL_SENDER) {
      const text = dedent`
      C4 finding submitted: 
      risk = ${risk}
      
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
