import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

// types
import { Contest } from "../../types/contest";
import {
  Finding,
  FindingDeleteRequest,
  FindingEditRequest,
  FindingsResponse,
} from "../../types/finding";
import { TeamData } from "../../types/user";

// utils
import { checkAuth, checkTeamAuth } from "../util/auth-utils";
import {
  getContest,
  getRiskCodeFromGithubLabel,
  isContestActive,
} from "../util/contest-utils";
import {
  getAvailableFindings,
  getMarkdownReportForUser,
  getRepoName,
  wardenFindingsForContest,
} from "../util/github-utils";
import {
  getUserTeams,
  updateTeamAddress,
  sendConfirmationEmail,
} from "../util/user-utils";

// config
import { apiKey, domain } from "../_config";

async function getFinding(
  username: string,
  contest: Contest,
  issueId: number
): Promise<Response> {
  const client = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const submission_files = (
    await getAvailableFindings(client, username, contest)
  ).filter((item) => {
    if (item.issueNumber === issueId) {
      return item;
    }
  });

  // todo: don't rely on full listing
  let finding;
  if (submission_files.length === 1) {
    const findings = (
      await wardenFindingsForContest(
        client,
        submission_files[0].handle,
        contest
      )
    ).filter((item) => {
      if (item.issueNumber === issueId) {
        return item;
      }
    });

    if (findings.length === 1) {
      finding = findings[0];
    }
  }

  if (finding) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finding),
    };
  }

  return {
    statusCode: 500,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: "problem fetching finding" }),
  };
}

async function getFindings(
  username: string,
  contest: Contest,
  includeTeams: boolean = true
): Promise<Response> {
  // first phase:
  // given active contest id
  // [x] warden can see own findings
  // [x] warden can see team findings
  // [x] can see specific finding
  // [x] team findings
  // [x] make team findings optional

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const wardenFindings: Finding[] = await wardenFindingsForContest(
    octokit,
    username,
    contest
  );

  const res: FindingsResponse = {
    user: wardenFindings,
    teams: {},
  };

  if (includeTeams) {
    const teamHandles = await getUserTeams(username);

    for (const teamHandle of teamHandles) {
      const teamFindings: Finding[] = await wardenFindingsForContest(
        octokit,
        teamHandle,
        contest
      );
      res.teams[teamHandle] = teamFindings;
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(res),
  };
}

async function handleAttributionChange(
  client,
  repoName,
  issueNumber,
  username,
  attributedTo: { newValue: string; oldValue: string; address: string }
) {
  if (attributedTo.newValue !== username) {
    const team: TeamData = await checkTeamAuth(attributedTo.newValue, username);
    // @todo: remove this once all teams have saved addresses
    if (!team.address) {
      try {
        await updateTeamAddress(team, attributedTo.address);
      } catch (error) {
        // don't throw error if this PR fails - there will likely be duplicates
        // due to the fact that PRs take some time to review and merge and we
        // don't want to block teams from submitting findings in the meantime
        console.warn(error);
      }
    }
  }
  const oldPath = `data/${attributedTo.oldValue}-${issueNumber}.json`;
  const newPath = `data/${attributedTo.newValue}-${issueNumber}.json`;

  const oldContents = await client.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      path: oldPath,
    }
  );

  const newContents = JSON.parse(
    // @ts-ignore // @todo: fix this typescript error
    Buffer.from(oldContents.data.content, "base64").toString()
  );
  newContents.handle = attributedTo.newValue;
  newContents.address = attributedTo.address;

  const newFileResponse = await client.createOrUpdateTextFile({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: repoName,
    path: newPath,
    content: JSON.stringify(newContents),
    message: `Issue #${issueNumber} attribution changed from ${attributedTo.oldValue} to ${attributedTo.newValue} by ${username}`,
  });

  if (!newFileResponse.updated) {
    throw { message: "Problem writing new file" };
  }

  const oldFileResponse = await client.createOrUpdateTextFile({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: repoName,
    path: oldPath,
    content: null,
    message: `File replaced by ${newPath} by ${username}`,
  });

  if (!oldFileResponse.deleted) {
    throw { message: "Problem removing old file" };
  }
}

async function editFinding(
  username: string,
  contest: Contest,
  issueNumber: number,
  data: FindingEditRequest
): Promise<void> {
  const CustOcto = Octokit.plugin(createOrUpdateTextFile);
  const client = new CustOcto({ auth: process.env.GITHUB_TOKEN });

  // don't allow users to change risk to or from QA or gas
  const oldRiskCode = getRiskCodeFromGithubLabel(data.risk.oldValue);
  const newRiskCode = getRiskCodeFromGithubLabel(data.risk.newValue);
  const isQaOrGasSubmission = Boolean(
    newRiskCode === "Q" ||
      newRiskCode === "G" ||
      oldRiskCode === "Q" ||
      oldRiskCode === "G"
  );
  if (oldRiskCode !== newRiskCode) {
    if (oldRiskCode === "Q" || oldRiskCode === "G") {
      throw {
        message: `You cannot change the risk level for ${data.risk.oldValue} reports.`,
      };
    }
    if (newRiskCode === "Q" || newRiskCode === "G") {
      throw {
        message: `You cannot convert risk from ${data.risk.oldValue} to ${data.risk.newValue}. Try withdrawing your finding and then adding it to your ${data.risk.newValue} report.`,
      };
    }
  }

  // don't allow users to change attribution of QA or gas reports
  if (
    isQaOrGasSubmission &&
    data.attributedTo.oldValue !== data.attributedTo.newValue
  ) {
    throw {
      message:
        "You cannot change the author of a QA or Gas report. If you meant to submit your report as " +
        data.attributedTo.newValue +
        " instead of " +
        data.attributedTo.oldValue +
        ", you can withdraw this report and submit a new one as " +
        data.attributedTo.newValue,
    };
  }

  let edited = false;

  const owner = process.env.GITHUB_REPO_OWNER!;
  const repoName = getRepoName(contest);

  const available_findings = await getAvailableFindings(
    client,
    username,
    contest
  );

  const canAccess =
    available_findings.find((f) => {
      if (f.issueNumber === issueNumber) {
        return true;
      }
    }) !== undefined;

  if (!canAccess) {
    throw {
      message: "No submission found to edit",
    };
  }

  let emailBody = `Updated by: ${username}`;

  // Only handle attribution changes between Med and High
  if (
    !isQaOrGasSubmission &&
    data.attributedTo.oldValue !== data.attributedTo.newValue
  ) {
    handleAttributionChange(
      client,
      repoName,
      issueNumber,
      username,
      data.attributedTo
    );
    emailBody =
      `Attribution changed from ${data.attributedTo.oldValue} to ${data.attributedTo.newValue}\n\n` +
      `Wallet address: ${data.attributedTo.address}\n\n` +
      emailBody;
    edited = true;
  }

  // Only handle risk changes between Med and High
  if (!isQaOrGasSubmission && data.risk.oldValue !== data.risk.newValue) {
    try {
      await client.request(
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
        {
          owner: process.env.GITHUB_REPO_OWNER!,
          repo: repoName,
          issue_number: issueNumber,
          name: data.risk.oldValue,
        }
      );
    } catch (error) {
      throw {
        status: error.status || 500,
        message: `Error removing old label: [${data.risk.oldValue}] - ${
          error.message || "unknown"
        }`,
      };
    }

    try {
      await client.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
        {
          owner: process.env.GITHUB_REPO_OWNER!,
          repo: repoName,
          issue_number: issueNumber,
          labels: [data.risk.newValue],
        }
      );
    } catch (error) {
      throw {
        status: error.status || 500,
        message: `Error adding new label: [${data.risk.newValue}] - ${
          error.message || "unknown"
        }`,
      };
    }

    emailBody =
      `Risk changed from ${data.risk.oldValue} to ${data.risk.newValue}\n\n` +
      emailBody;
    edited = true;
  }

  // Simple field handling {title, body}
  const simpleFields: { title?: string; body?: string } = {};

  if (data.title) {
    simpleFields.title = data.title;
    emailBody = `Title changed: ${data.title}\n\n` + emailBody;
    edited = true;
  }

  if (data.body) {
    if (isQaOrGasSubmission) {
      await client.createOrUpdateTextFile({
        owner,
        repo: repoName,
        path: `data/${data.attributedTo.newValue}-${newRiskCode}.md`,
        content: data.body,
        message: `Report for issue #${issueNumber} updated by ${username}`,
      });
      // @todo: remove this once we can be sure all reports are saved as md files
      const markdownPath = `https://github.com/${owner}/${repoName}/blob/main/data/${data.attributedTo.newValue}-${newRiskCode}.md`;
      simpleFields.body = `See the markdown file with the details of this report [here](${markdownPath}).`;
    } else {
      simpleFields.body = data.body;
    }
    emailBody = `Report contents changed: ${data.body}\n\n` + emailBody;
    edited = true;
  }

  if (simpleFields.title !== undefined || simpleFields.body !== undefined) {
    await client.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      issue_number: issueNumber,
      ...simpleFields,
    });
  }

  if (!edited) {
    // throw?
    // {
    //   status: 204,
    //   body: "Nothing changed",
    // };
    return;
  }

  await client.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
    {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      issue_number: issueNumber,
      labels: ["edited-by-warden"],
    }
  );

  if (apiKey && domain && process.env.EMAIL_SENDER) {
    const subject = `C4 ${contest.sponsor} finding updated`;

    await sendConfirmationEmail(data.emailAddresses, subject, emailBody);
  }
}

async function deleteFinding(
  username: string,
  contest: Contest,
  issueNumber: number,
  risk: string,
  attributedTo: string,
  emailAddresses: string[]
) {
  // @todo:
  // [x] delete markdown file for QA and Gas reports
  // [x] close issue
  // [x] add comment "withdrawn by x"
  // [x] add "withdrawn by warden" and "Invalid" labels
  // [x] send confirmation email

  const CustOcto = Octokit.plugin(createOrUpdateTextFile);
  const client = new CustOcto({ auth: process.env.GITHUB_TOKEN });

  const repoName = getRepoName(contest);
  const owner = process.env.GITHUB_REPO_OWNER!;

  const riskCode = getRiskCodeFromGithubLabel(risk);
  if (riskCode === "Q" || riskCode === "G") {
    // setting content to null deletes the file
    await client.createOrUpdateTextFile({
      owner,
      repo: repoName,
      path: `data/${attributedTo}-${riskCode}.md`,
      content: null,
      message: `report for issue #${issueNumber} withdrawn by ${username}`,
    });
  }

  // close issue and update labels at the same time
  await client.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
    owner,
    repo: repoName,
    issue_number: issueNumber,
    state: "closed",
    labels: ["withdrawn by warden", "Invalid", risk],
  });

  await client.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner,
      repo: repoName,
      issue_number: issueNumber,
      body: `Withdrawn by ${username}`,
    }
  );
  const subject = `C4 ${contest.sponsor} finding withdrawn by ${username}`;
  // @todo: Maybe include more information about the deleted finding
  const emailBody = `Issue #${issueNumber} with risk ${risk} withdrawn by ${username}`;

  await sendConfirmationEmail(emailAddresses, subject, emailBody);
}

const handler: Handler = async (event: Event): Promise<Response> => {
  // @todo: better error handling
  try {
    if (!(await checkAuth(event))) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }

    // should contestId always be included in query params for consistency?
    let contestId;
    if (event.queryStringParameters?.contest) {
      contestId = parseInt(event.queryStringParameters?.contest);
    } else if (event.body) {
      const data = JSON.parse(event.body);
      contestId = data.contest;
    }

    // make sure the given contest is still active
    const contest = await getContest(contestId);
    if (!contest) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Contest not found",
        }),
      };
    }
    if (!isContestActive(contest)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "This contest has ended.",
        }),
      };
    }

    // simple param filling
    let username;
    if (event.headers["c4-user"]) {
      username = event.headers["c4-user"];
    }
    let issueNumber;

    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters?.issue) {
          issueNumber = parseInt(event.queryStringParameters?.issue);
        }

        let includeTeams = true;
        // @todo: use flag to include teams in query params
        // if (req.queryStringParameters?.includeTeams) {
        // includeTeams = req.queryStringParameters?.includeTeams)
        // }

        if (issueNumber !== undefined) {
          return await getFinding(username, contest, issueNumber);
        } else {
          return await getFindings(username, contest, includeTeams);
        }
      case "POST":
        const data: FindingEditRequest = JSON.parse(event.body!);
        try {
          await editFinding(username, contest, data.issue, data);
          return {
            statusCode: 200,
            body: "SUCCESS!",
          };
        } catch (error) {
          return {
            statusCode: error.status || 500,
            body: JSON.stringify({
              error: error.message || "something went wrong editing submission",
            }),
          };
        }
      case "DELETE":
        const {
          attributedTo,
          risk,
          emailAddresses,
        }: FindingDeleteRequest = JSON.parse(event.body!);
        issueNumber = parseInt(event.queryStringParameters?.issue!);
        if (!issueNumber || !attributedTo || !risk) {
          return {
            statusCode: 422,
            body: JSON.stringify({
              error: "Issue number, attribution, and risk are required",
            }),
          };
        }

        if (attributedTo !== username) {
          await checkTeamAuth(attributedTo, username);
        }
        await deleteFinding(
          username,
          contest,
          issueNumber,
          risk,
          attributedTo,
          emailAddresses
        );
        return {
          statusCode: 200,
          body: "SUCCESS!",
        };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "nuh-uh",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message || "Something went wrong" }),
    };
  }
};

export { handler };
