import { differenceInDays, getYear } from "date-fns";
import fs, { readFileSync } from "fs";
import csv from "csvtojson";

const getWardenInfo = async (handle: string): Promise<any> => {
  const wardenFile = readFileSync(`./_data/handles/${handle}.json`);
  const warden = await JSON.parse(wardenFile.toString());
  return warden;
};

const getLeaderboardResults = async (
  handle: string,
  contestId: number,
  contestRange: string
) => {
  const allFindings = await csv().fromFile("_data/findings/findings.csv");
  console.log("all findings OK");
  // @TODO: also filter by contestId (if provided)
  const allContests = (await csv().fromFile("_data/contests/contests.csv"))
    .filter((contest) => withinTimeframe(contest, contestRange))
    .map((contest) => parseInt(contest.contestid, 10));
  console.log("All contests OK");

  // get findings, filtered by contest
  const relevantFindings = allFindings
    .map((finding) => {
      finding.contest = parseInt(finding.contest, 10);
      return finding;
    })
    .filter((finding) =>
      allContests.some((contest) => contest === finding.contest)
    );
  console.log("Relevant Findings OK");

  // get deduplicated handles from findings
  const allHandles: string[] = Array.from(
    new Set(relevantFindings.map((finding) => finding.handle))
  );

  //TODO Fix avatar, as pointing to wrong path.
  console.log("Trigger build results ....");
  const result: any[] = [];
  for (const handle of [...new Set(allHandles)]) {
    const wardenInfo = await getWardenInfo(handle);
    const wardensFindings = relevantFindings.filter(
      (finding) => finding.handle === handle
    );
    const handleData = {
      handle: wardenInfo.handle,
      image: wardenInfo.image
        ? `https://raw.githubusercontent.com/code-423n4/code423n4.com/main/_data/handles/avatars/${wardenInfo.image.slice(
            2
          )}`
        : "",
      link: wardenInfo.link,
      members: wardenInfo.members,
      lowRisk: 0,
      medRisk: 0,
      soloMed: 0,
      highRisk: 0,
      soloHigh: 0,
      nonCrit: 0,
      gasOptz: 0,
      allFindings: 0,
      awardTotal: 0,
    };

    const combinedData = {
      ...handleData,
      ...computeResults(wardensFindings),
    };
    if (combinedData.allFindings > 0) {
      result.push(combinedData);
    }
  }

  // const leaderboardResults = await buildResults();
  // return allHandles;
  return result;
};

const withinLastNDays = (contestEnd, numDays) => {
  return differenceInDays(new Date(), contestEnd) <= numDays;
};

const withinYear = (contestEnd, year) => {
  return getYear(contestEnd) === year;
};

function withinTimeframe(contest, timeFrame) {
  switch (timeFrame) {
    case "Last 60 days":
      return withinLastNDays(new Date(contest.end_time), 60);
    case "Last 90 days":
      withinLastNDays(new Date(contest.end_time), 90);
    case "2022":
      return withinYear(new Date(contest.end_time), 2022);
    case "2021":
      return withinYear(new Date(contest.end_time), 2021);
    default:
      return true;
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
    results.awardTotal += +f.awardUSD ?? 0;

    switch (f.risk.toLowerCase()) {
      case "0":
        results.nonCrit += 1;
        break;
      case "1":
        results.lowRisk += 1;
        break;
      case "2":
        results.medRisk += 1;
        if (+f.split === 1) {
          results.soloMed += 1;
        }
        break;
      case "3":
        results.highRisk += 1;
        if (+f.split === 1) {
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
      body: JSON.stringify(
        await getLeaderboardResults(contestHandle, contestId, contestRange)
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString(), details: error.stack }),
    };
  }
};
