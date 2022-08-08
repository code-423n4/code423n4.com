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

export { getContest, isContestActive };
