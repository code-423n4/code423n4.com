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
  const allContests = await csv().fromFile("_data/contests/contests.csv");
  const filteredContests = filterFindingsByTimeFrame(allContests, contestRange);
  const allHandles: string[] = [];
  const relevantFindings = allFindings
    .map((finding) => {
      if (
        filteredContests.some(
          (contest) => contest.contestid === finding.contest
        )
      ) {
        allHandles.push(finding.handle);
        return finding;
      } else {
        return undefined;
      }
    })
    .filter((el) => el !== undefined);

  const buildResults = async () => {
    const result: any[] = [];

    for (const handle of [...new Set(allHandles)]) {
      const wardenInfo = await getWardenInfo(handle);
      const wardensFindings = relevantFindings.filter(
        (finding) => finding.handle === handle
      );
      const handleData = {
        handle: wardenInfo.handle,
        image: wardenInfo.image,
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
    return result;
  };
  const allFindingsFiltered = await buildResults();

  let result = [
    {
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
    },
  ];

  return {
    result: allFindingsFiltered,
    // allContests: filteredContests,
    // allFindings,
    // relevantFindings,
    // allFindingsFiltered,
  };
};

const withinLastNDays = (contestEnd, numDays) => {
  return differenceInDays(new Date(), contestEnd) <= numDays;
};

const withinYear = (contestEnd, year) => {
  return getYear(contestEnd) === year;
};

function filterFindingsByTimeFrame(allContests, timeFrame) {
  switch (timeFrame) {
    case "Last 60 days":
      return allContests.filter((f) =>
        withinLastNDays(new Date(f.end_time), 60)
      );
    case "Last 90 days":
      return allContests.filter((f) =>
        withinLastNDays(new Date(f.end_time), 90)
      );
    case "2022":
      return allContests.filter((f) => withinYear(new Date(f.end_time), 2022));
    case "2021":
      return allContests.filter((f) => withinYear(new Date(f.end_time), 2021));
    default:
      return allContests;
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
