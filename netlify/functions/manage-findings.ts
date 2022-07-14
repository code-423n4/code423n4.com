import { Handler } from "@netlify/functions";

import { getContestEnd } from "../util/contest-utils";
import { checkAuth } from "../util/auth-utils";

// wip: endpoint for self-serve submission editing

async function getFindings(req) {
  // the request needs to come from an authenticated warden
  // they can see their findings for active contests
  // they can see their teams' findings for active contests
  // there are some parameters?
  const contestId = parseInt(req.queryStringParameters?.contest);

  // 1. all or one contest
  // 2. all active contests (or specific)

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
