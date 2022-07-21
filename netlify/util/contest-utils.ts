import csv from "csvtojson";

async function getContest(contestId) {
  const allContests = await csv().fromFile("_data/contests/contests.csv");
  let contests = allContests;
  if (process.env.NODE_ENV === "development") {
    const testContests = await csv().fromFile(
      "_test-data/contests/contests.csv"
    );
    contests = contests.concat(testContests);
  }
  //const contests = await csv().fromFile("_data/contests/contests.csv");
  const contest = contests.find((c) => c.contestid == contestId);
  return contest;
}

function isContestActive(contest) {
  if (!contest) {
    return false;
  }

  const now = Date.now();
  const start = new Date(contest.start_time).getTime();
  const end = new Date(contest.end_time).getTime();

  return now >= start && now <= end;
}

export { getContest, isContestActive };
