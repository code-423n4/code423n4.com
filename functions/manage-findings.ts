// wip: endpoint for self-serve submission editing

function getFindings(req) {
  // the request needs to come from an authenticated warden
  // they can see their findings for active contests
  // they can see their teams' findings for active contests
  // there are some parameters?
  console.log(req);
  const contestId = parseInt(req.queryStringParameters?.contest);
  console.log(contestId);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

function editFinding(req) {
  // an authenticated warden can edit a finding
  //   for active contests
  //     their own (their teams')
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export async function handler(event) {
  switch (event.httpMethod) {
    case "GET":
      return getFindings(event);
    case "POST":
      return editFinding(event);
    default:
      return {
        statusCode: 418,
        body: JSON.stringify({
          error: "nuh-uh",
        })
      }
  }
};
