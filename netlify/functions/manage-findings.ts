import { Handler } from "@netlify/functions";
import { Octokit } from "@octokit/core";

import { checkAuth } from "../util/auth-utils";
import { getContest, isContestActive } from "../util/contest-utils";
import { wardenFindingsForContest } from "../util/github-utils";


async function getFindings(req) {
  // first phase:
  // given active! contest id
  // [ ] warden can see own findings
  // [ ] warden can see team findings

  // todo: ensure contestId / wardenHandle exist?
  const contestId = parseInt(req.queryStringParameters?.contest);
  const wardenHandle = req.headers["c4-user"];

  const contest = await getContest(contestId);

  if (!isContestActive(contest)) {
    // throw?
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const wardenFindings = await wardenFindingsForContest(octokit, wardenHandle, contest);

  // if (req.queryStringParameters?.teamFindings) {
  //   await wardenFindingsForContest(teamHandle, contest.repo);
  // }

  const res = {
    [wardenHandle]: wardenFindings,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}

async function editFinding(req) {
  // an authenticated warden can edit a finding
  //   for active contests
  //     their own (their teams')
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

const handler: Handler = async (event, context) => {
  if (!(await checkAuth(event))) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  switch (event.httpMethod) {
    case "GET":
      return await getFindings(event);
    case "POST":
      return await editFinding(event);
    default:
      return {
        statusCode: 418,
        body: JSON.stringify({
          error: "nuh-uh",
        })
      }
  }
};

export { handler };
