import { Handler } from "@netlify/functions";

import { checkAuth } from "../util/auth-utils";
import { isContestActive } from "../util/contest-utils";


async function getFindings(req) {
  const contestId = parseInt(req.queryStringParameters?.contest);

  // first phase:
  // given active! contest id
  if (!(await isContestActive(contestId))) {
    // throw?
  }

  // warden can see own findings
  // warden can see team findings

  return {
    statusCode: 200,
    body: JSON.stringify({}),
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
  if (!checkAuth(event)) {
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
