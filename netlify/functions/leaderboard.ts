import { differenceInDays, getYear } from "date-fns";
import fs, { readFileSync } from "fs";
import { AwardFinding } from "../../types/finding";
import { getApiContestData } from "../util/getContestsData";
import { getApiFindingsData } from "../util/getFindingsData";
import { DBContest } from "../../types/contest";

const getWardenInfo = (handle: string) => {
  const wardenFile = readFileSync(`./_data/handles/${handle}.json`);
  const warden = JSON.parse(wardenFile.toString());

  if (warden.image) {
    warden.image = warden.image.replace(/^[.]\/avatars\//, "");
  }

  // get members for team if team
  if (warden.members && warden.members.length > 0) {
    warden.members = warden.members.map((handle) => getWardenInfo(handle));
  }
  return warden;
};

const getLeaderboardResults = async (
  contestRange: string,
  contestId?: string,
  handle?: string
) => {
  // @TODO: also filter by contestId (if provided)
  const allContests = await getApiContestData();

  const filteredContests = allContests
    .filter(
      (contest: DBContest) =>
        withinTimeframe(contest, contestRange) || !contestRange
    )
    .filter((contest) => !contestId || Number(contestId) === contest.contestid);

  // get findings, filtered by contest
  const allFindings = (await getApiFindingsData()).filter((finding) =>
    filteredContests.some((contest) => contest.contestid === finding.contest)
  );

  // get deduplicated handles from findings
  const allHandles = Array.from(
    new Set(allFindings.map((finding: AwardFinding) => finding.handle))
  )
    .map((handle: string) => getWardenInfo(handle))
    .filter(
      (handle) =>
        handle.showOnLeaderboard === undefined || !handle.showOnLeaderboard
    );
  return computeWardenStats(allHandles, allFindings);
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
      return withinLastNDays(new Date(contest.end_time), 90);
    case "Current Year":
      const currentYear = new Date().getFullYear();
      return withinYear(new Date(contest.end_time), currentYear);
    case "2023":
      return withinYear(new Date(contest.end_time), 2023);
    case "2022":
      return withinYear(new Date(contest.end_time), 2022);
    case "2021":
      return withinYear(new Date(contest.end_time), 2021);
    case "All time":
      return true;
    default:
      return false;
  }
}

function computeWardenStats(wardens, findings) {
  const result: any[] = [];
  for (const wardenObj of wardens) {
    const wardensFindings = findings.filter(
      (finding) => finding.handle === wardenObj.handle
    );

    const handleData = {
      handle: wardenObj.handle,
      image: wardenObj.image
        ? `https://raw.githubusercontent.com/code-423n4/code423n4.com/main/_data/handles/avatars/${wardenObj.image}`
        : "",
      link: wardenObj.link,
      members: wardenObj.members,
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

  return result;
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
      body: JSON.stringify(
        await getLeaderboardResults(contestRange, contestId, contestHandle)
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString(), details: error.stack }),
    };
  }
};
