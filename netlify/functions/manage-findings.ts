import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

import {
  Finding,
  FindingEditRequest,
  FindingsResponse,
} from "../../types/finding";
import { Contest } from "../../types/contest";

import { checkAuth } from "../util/auth-utils";
import { getContest, isContestActive } from "../util/contest-utils";
import {
  getAvailableFindings,
  wardenFindingsForContest,
} from "../util/github-utils";
import {
  getUserTeams,
  checkAndUpdateTeamAddress,
  sendConfirmationEmail,
} from "../util/user-utils";

import { apiKey, domain } from "../_config";

async function getFinding(
  username: string,
  issueId: number,
  contest: Contest
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
  includeTeams: boolean = true,
  contest: Contest
): Promise<Response> {
  // first phase:
  // given active contest id
  // [x] warden can see own findings
  // [x] warden can see team findings
  // [x] can see specific finding
  // [x] team findings
  // [ ] make team findings optional? (query param)

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

async function editFinding(
  username: string,
  issueNumber: number,
  data: FindingEditRequest,
  contest: Contest
): Promise<void> {
  const CustOcto = Octokit.plugin(createOrUpdateTextFile);
  const client = new CustOcto({ auth: process.env.GITHUB_TOKEN });

  let edited = false;

  // todo: move to more general place
  // const RiskCodeToGithubLabel = {
  //   "3": "3 (High Risk)",
  //   "2": "2 (Med Risk)",
  //   Q: "QA (Quality Assurance)",
  //   G: "G (Gas Optimizations)",
  // };

  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

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

  if (data.attributedTo) {
    await checkAndUpdateTeamAddress(
      data.attributedTo.newValue,
      username,
      data.attributedTo.address
    );
    const oldPath = `data/${data.attributedTo.oldValue}-${issueNumber}.json`;
    const newPath = `data/${data.attributedTo.newValue}-${issueNumber}.json`;

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
    newContents.handle = data.attributedTo.newValue;
    newContents.address = data.attributedTo.address;

    const newRes = await client.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      path: newPath,
      content: JSON.stringify(newContents),
      message: `Issue #${issueNumber} attribution changed from ${data.attributedTo.oldValue} to ${data.attributedTo.newValue} by ${username}`,
    });

    if (!newRes.updated) {
      throw { message: "Problem writing new file" };
    }

    const oldRes = await client.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      path: oldPath,
      content: null,
      message: `File replaced by ${newPath} by ${username}`,
    });

    if (!oldRes.deleted) {
      throw { message: "Problem removing old file" };
    }

    emailBody =
      `Attribution changed from ${data.attributedTo.oldValue} to ${data.attributedTo.newValue}\n\n` +
      `Wallet address: ${data.attributedTo.address}` +
      emailBody;
    edited = true;
  }

  if (data.risk) {
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

  if (data.title && data.body) {
    // did both title and body change?
    await client.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      issue_number: issueNumber,
      title: data.title,
      body: data.body,
    });

    emailBody =
      `Title changed: ${data.title}\n\n` +
      `Report contents changed: ${data.body}\n\n` +
      emailBody;
    edited = true;
  } else if (data.title) {
    // did title change?
    await client.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      issue_number: issueNumber,
      title: data.title,
    });

    emailBody = `Title changed: ${data.title}\n\n` + emailBody;
    edited = true;
  } else if (data.body) {
    // did body change?
    await client.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      issue_number: issueNumber,
      body: data.body,
    });

    emailBody = `Report contents changed: ${data.body}\n\n` + emailBody;
    edited = true;
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

const handler: Handler = async (event: Event): Promise<Response> => {
  // todo: error handling..

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

  switch (event.httpMethod) {
    case "GET":
      let issueNumber;
      if (event.queryStringParameters?.issue) {
        issueNumber = parseInt(event.queryStringParameters?.issue);
      }

      let includeTeams = true;
      // if (req.queryStringParameters?.includeTeams) {
      // includeTeams = req.queryStringParameters?.includeTeams)
      // }

      if (issueNumber !== undefined) {
        return await getFinding(username, issueNumber, contest);
      } else {
        return await getFindings(username, includeTeams, contest);
      }
    case "POST":
      const data: FindingEditRequest = JSON.parse(event.body!);
      try {
        await editFinding(username, data.issue, data, contest);
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
  }

  return {
    statusCode: 418,
    body: JSON.stringify({
      error: "nuh-uh",
    }),
  };
};

export { handler };
