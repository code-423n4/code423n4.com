import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

import {
  Finding,
  FindingEditRequest,
  FindingResponse,
  FindingsResponse,
} from "../../types/findings";

import { checkAuth } from "../util/auth-utils";
import { getContest, isContestActive } from "../util/contest-utils";
import {
  getAvailableFindings,
  wardenFindingsForContest,
} from "../util/github-utils";
import { getUserTeams } from "../util/user-utils";

async function getFinding(
  username: string,
  contestId: number,
  issueId: number
): Promise<Response> {
  const client = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const contest = await getContest(contestId);

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
    const res: FindingResponse = {
      name: submission_files[0].handle,
      finding: finding,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(res),
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
  contestId: number,
  includeTeams: boolean = true
): Promise<Response> {
  // first phase:
  // given active! contest id
  // [x] warden can see own findings
  // [x] warden can see team findings
  // [ ] can see specific finding
  // [ ] team findings optional? (query param)

  const contest = await getContest(contestId);

  if (!isContestActive(contest)) {
    // throw?
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const wardenFindings: Finding[] = await wardenFindingsForContest(
    octokit,
    username,
    contest
  );

  const res: FindingsResponse = {
    user: wardenFindings.map((finding) => ({
      ...finding,
      attributedTo: username,
    })),
    teams: {},
  };

  if (includeTeams) {
    // todo: move to util?
    const teamHandles = await getUserTeams(username);

    for (const teamHandle of teamHandles) {
      const teamFindings: Finding[] = await wardenFindingsForContest(
        octokit,
        teamHandle,
        contest
      );
      res.teams[teamHandle] = teamFindings.map((finding) => ({
        ...finding,
        attributedTo: teamHandle,
      }));
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
  contestId: number,
  issueNumber: number,
  data: FindingEditRequest
): Promise<Response> {
  // an authenticated warden can edit a finding
  //   for active contests
  //     their own (their teams')
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

  // get contest to find repo
  const contest = await getContest(contestId);
  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

  // modifications to issueid

  // check for authorization to edit --
  // the issue is warden or team
  const available_findings = await getAvailableFindings(
    client,
    username,
    contest
  );

  const canAccess =
    available_findings.find((f) => {
      console.log(f.issueNumber, issueNumber);
      if (f.issueNumber === issueNumber) {
        return true;
      }
    }) !== undefined;

  if (!canAccess) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "no submission found to edit" }),
    };
  }

  // did attribution change?
  if (data.attributedTo) {
    // if team (attributedTo is not c4User) and team address is not already saved, save team address

    const oldPath = `data/${data.attributedTo.oldValue}-${issueNumber}.json`;
    const newPath = `data/${data.attributedTo.newValue}-${issueNumber}.json`;

    // read issue-json
    const old_contents = await client.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: repoName,
        path: oldPath,
      }
    );

    // change "address" value to data.wallet
    const new_data = JSON.parse(
      Buffer.from(old_contents.data.content, "base64").toString()
    );
    new_data.address = data.attributedTo.address;

    // write/rename issue-json
    // save the re-attributed
    const newRes = await client.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      path: newPath,
      content: JSON.stringify(new_data),
      message: `Issue #${issueNumber} attribution changed from ${data.attributedTo.oldValue} to ${data.attributedTo.newValue} by ${username}`,
    });

    if (!newRes.updated) {
      throw "Problem writing new file";
    }

    // delete the original
    const oldRes = await client.createOrUpdateTextFile({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: repoName,
      path: oldPath,
      content: null,
      message: "removing old file",
    });

    if (!oldRes.deleted) {
      throw "Problem removing old file";
    }

    edited = true;
  }

  // did risk change?
  if (data.risk) {
    // these are GitHub-named already?
    // remove label corresponding to data.risk.oldValue
    await client.request(
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: repoName,
        issue_number: issueNumber,
        // name: RiskCodeToGithubLabel[data.risk.oldValue],
        name: data.risk.oldValue,
      }
    );

    // add label corresponding to data.risk.newValue
    await client.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: repoName,
        issue_number: issueNumber,
        // labels: [RiskCodeToGithubLabel[data.risk.newValue]],
        labels: [data.risk.newValue],
      }
    );

    edited = true;
  }

  // simple field updates

  // did title change?
  if (data.title) {
    edited = true;
  }

  // did body change?
  if (data.body) {
    edited = true;
  }

  if (edited) {
    // apply edited-by-warden label
    await client.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: repoName,
        issue_number: issueNumber,
        labels: ["edited-by-warden"],
      }
    );

    // todo: send e-mails
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: "something went wrong editing submission" }),
  };
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

  // todo: active contest only?

  // simple param filling
  let username;
  if (event.headers["c4-user"]) {
    username = event.headers["c4-user"];
  }

  switch (event.httpMethod) {
    case "GET":
      let contestId;
      if (event.queryStringParameters?.contest) {
        contestId = parseInt(event.queryStringParameters?.contest);
      }

      let issueNumber;
      if (event.queryStringParameters?.issue) {
        issueNumber = parseInt(event.queryStringParameters?.issue);
      }

      let includeTeams = true;
      // if (req.queryStringParameters?.includeTeams) {
      // includeTeams = req.queryStringParameters?.includeTeams)
      // }

      if (issueNumber !== undefined) {
        return await getFinding(username, contestId, issueNumber);
      } else {
        return await getFindings(username, contestId, includeTeams);
      }
    case "POST":
      // const data: FindingEditRequest = JSON.parse(event.body!);
      // return await editFinding(username, data.contest, data.issue, data);

      const data = JSON.parse(event.body!);
      return await editFinding(
        username,
        data.contest,
        parseInt(data.issueId),
        data
      );
  }

  return {
    statusCode: 418,
    body: JSON.stringify({
      error: "nuh-uh",
    }),
  };
};

export { handler };
