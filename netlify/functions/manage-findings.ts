import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Context } from "@netlify/functions/src/function/context";
import { Octokit } from "@octokit/core";
import fetch from "node-fetch";

import { checkAuth } from "../util/auth-utils";
import { getContest, isContestActive } from "../util/contest-utils";
import { wardenFindingsForContest } from "../util/github-utils";

async function getFindings(req: Event): Promise<Response> {
  // first phase:
  // given active! contest id
  // [x] warden can see own findings
  // [ ] warden can see team findings

  // todo: ensure contestId / wardenHandle exist?
  const contestId = parseInt(req.queryStringParameters?.contest);
  const wardenHandle = req.headers["c4-user"];

  // todo: move to util?
  let teamHandles = [];
  try {
    const teamUrl = `${process.env.URL}/.netlify/functions/get-team?id=${wardenHandle}`;
    const teams = await fetch(teamUrl);
    if (teams.status === 200) {
      const teamsData = await teams.json();
      teamHandles = teamsData.map((team) => team.handle);
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message || error }),
    };
  }

  const contest = await getContest(contestId);

  if (!isContestActive(contest)) {
    // throw?
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const wardenFindings = await wardenFindingsForContest(
    octokit,
    wardenHandle,
    contest
  );

  const res = {
    user: wardenFindings,
    teams: {},
  };

  // if (req.queryStringParameters?.teamFindings) {

  // }

  if (teamHandles && teamHandles.length > 0) {
    teamHandles.forEach(async (teamHandle) => {
      const teamFindings = await wardenFindingsForContest(
        octokit,
        teamHandle,
        contest
      );
      res["teams"][teamHandle] = teamFindings;
    });
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
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

const handler: Handler = async (
  event: Event,
  context: Context
): Promise<Response> => {
  // todo: error handling..

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
        }),
      };
  }
};

export { handler };
