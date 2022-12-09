import { differenceInDays, getYear } from "date-fns";

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

const withinLastNDays = (contestEnd, numDays) => {
  return differenceInDays(new Date(), contestEnd) <= numDays;
};

const withinYear = (contestEnd, year) => {
  return getYear(contestEnd) === year;
};

function filterFindingsByTimeFrame(findings, timeFrame) {
  switch (timeFrame) {
    case "Last 60 days":
      return findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 60)
      );
    case "Last 90 days":
      return findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 90)
      );
    case "2022":
      return findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2022)
      );
    case "2021":
      return findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2021)
      );
    default:
      return findings;
  }
}

function computeResults(findings) {
  const results = {
    lowRisk: 0,
    medRisk: 0,
    highRisk: 0,
    soloMed: 0,
    soloHigh: 0,
    nonCrit: 0,
    gasOptz: 0,
    allFindings: 0,
    awardTotal: 0,
  };

  findings.forEach((f) => {
    results.allFindings += 1;
    results.awardTotal += f.awardUSD ?? 0;

    switch (f.risk.toLowerCase()) {
      case "0":
        results.nonCrit += 1;
        break;
      case "1":
        results.lowRisk += 1;
        break;
      case "2":
        results.medRisk += 1;
        if (f.split === 1) {
          results.soloMed += 1;
        }
        break;
      case "3":
        results.highRisk += 1;
        if (f.split === 1) {
          results.soloHigh += 1;
        }
        break;
      case "g":
        results.gasOptz += 1;
        break;
      default:
        break;
    }
  });

  return results;
}

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
