import { Handler } from "@netlify/functions";

import Moralis from "moralis/node";

const {
  moralisAppId,
  moralisServerUrl,
} = require("../_config");

import { getContestEnd } from "../util/contest-utils";

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
  const authorization = event.headers["x-authorization"];

  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
  });

  // wip: from submit-finding auth
  //   do we need username? can we check session token?
  // const userUrl = `${event.headers.origin}/.netlify/functions/get-user?id=${user}`;
  // const userResponse = await fetch(userUrl);
  // if (!userResponse.ok) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "You must be registered to submit findings",
  //     }),
  //   };
  // }

  // const userData = await userResponse.json();
  // if (!userData || !userData.moralisId) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "You must be registered to submit findings",
  //     }),
  //   };
  // }

  // const { moralisId } = userData;
  // const sessionToken = authorization.split("Bearer ")[1];
  // const confirmed = await Moralis.Cloud.run("confirmUser", {
  //   sessionToken,
  //   moralisId,
  //   username: user,
  // });
  // if (!confirmed) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "Authorization failed",
  //     }),
  //   };
  // }

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
