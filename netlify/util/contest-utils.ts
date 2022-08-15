import csv from "csvtojson";
import { Contest } from "../../types/contest";

async function getContest(contestId: number): Promise<Contest | undefined> {
  const allContests = await csv().fromFile("_data/contests/contests.csv");
  let contests: Contest[] = allContests;
  if (process.env.NODE_ENV === "development") {
    const testContests = await csv().fromFile(
      "_test-data/contests/contests.csv"
    );
    contests = contests.concat(testContests);
  }
  const contest = contests.find((c) => parseInt(c.contestid) == contestId);
  return contest;
}

function isContestActive(contest: Contest): boolean {
  if (!contest) {
    return false;
  }

  const now = Date.now();
  const start = new Date(contest.start_time).getTime();
  const end = new Date(contest.end_time).getTime();

  return now >= start && now <= end;
}

// @todo: determine if this is the right place for these functions
const riskCodeToLabelMap = {
  "3": "3 (High Risk)",
  "2": "2 (Med Risk)",
  Q: "QA (Quality Assurance)",
  G: "G (Gas Optimization)",
};

function getRiskCodeFromGithubLabel(label: string): string {
  for (const code in riskCodeToLabelMap) {
    if (riskCodeToLabelMap[code] === label) {
      return code;
    }
  }
  throw { message: "risk not found" };
}

function getGithubLabelFromRiskCode(code: string): string {
  const label = riskCodeToLabelMap[code];
  if (label) {
    return label;
  }
  throw "risk label not found";
}

export {
  getContest,
  isContestActive,
  getRiskCodeFromGithubLabel,
  getGithubLabelFromRiskCode,
};
