import csv from "csvtojson";


async function getContestEnd(contestId) {
  // if (process.env.NODE_ENV === "development") {
  //   contests = csv().fromFile("_test-data/contests/contests.csv");
  // } else {
  //   contests = csv().fromFile("_data/contests/contests.csv");
  // }

  const contests = await csv().fromFile("_data/contests/contests.csv");
  const contest = contests.find((c) => c.contestid == contestId);

  if (contest) {
    return new Date(contest.end_time).getTime();
  }
  // else throw?
}


module.exports = {
  getContestEnd,
};
