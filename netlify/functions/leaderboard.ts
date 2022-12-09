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
    // range
    const contestRange = event.queryStringParameters.range;

    // handle
    const contestHandle = event.queryStringParameters.handle;

    // contest
    const contestId = event.queryStringParameters.contest;

    // @TODO: filter handles don't display on leaderboard
    //   maybe also add links from files (so we'll be)

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

    let res = [{
      handle: `${contestRange}-handle`,
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

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString(), details: error.stack }),
    };
  }
};
