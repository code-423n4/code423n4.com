import { addHours, isAfter, isBefore } from "date-fns";
import { Contest } from "../../types/contest";
import { getApiContestData } from "./getContestsData";

async function getContest(contestId: number): Promise<Contest | undefined> {
  const allContests = await getApiContestData();
  let contests: Contest[] = allContests;
  const contest = contests.find((c) => c.contestid == contestId);
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

function isBotRaceActive(contest: Contest): boolean {
  if (!contest) {
    return false;
  }

  const now = Date.now();
  const start = new Date(contest.start_time);
  const end = addHours(start, 1);

  return isAfter(now, start) && isBefore(now, end);
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
  return "";
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
  isBotRaceActive,
  getRiskCodeFromGithubLabel,
  getGithubLabelFromRiskCode,
};
