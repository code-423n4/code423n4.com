const getLeaderboardResults = async (
  handle: string,
  contestId: number,
  contestRange: string,
) => {
  // @TODO: filter handles don't display on leaderboard
  //   maybe also add links from files (so we'll be)

  // read csv
  // if using range, filter contest end_date
  // if using handle, filter handle
  // if using id, filter..

  // const handleData = {
  //   handle: p.handle,
  //   image: p.image,
  //   link: p.link,
  //   members: p.members,
  //   lowRisk: 0,
  //   medRisk: 0,
  //   soloMed: 0,
  //   highRisk: 0,
  //   soloHigh: 0,
  //   nonCrit: 0,
  //   gasOptz: 0,
  //   allFindings: 0,
  //   awardTotal: 0,
  // };

  let result = [{
    handle: `${contestRange}-handle-1`,
    image: "",
    link: "",
    members: [],
    lowRisk: 1,
    medRisk: 2,
    soloMed: 0,
    highRisk: 3,
    soloHigh: 0,
    nonCrit: 0,
    gasOptz: 0,
    allFindings: 6,
    awardTotal: 10,
  }];

  return result;
};

exports.handler = async (event) => {
  // only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed",
      headers: { Allow: "GET" },
    };
  }

  try {
    // handle
    const contestHandle = event.queryStringParameters.handle;

    // contest
    const contestId = event.queryStringParameters.contest;

    // range
    const contestRange = event.queryStringParameters.range;

    return {
      statusCode: 200,
      body: JSON.stringify(await getLeaderboardResults(contestHandle, contestId, contestRange)),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString(), details: error.stack }),
    };
  }
};
