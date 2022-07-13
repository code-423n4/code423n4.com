const csv = require("csvtojson");


function getContestEnd(contestId) {
  let contests;

  if (process.env.NODE_ENV === "development") {
    contests = csv().fromFile("_test-data/contests/contests.csv");
  } else {
    contests = csv().fromFile("_data/contests/contests.csv");
  }

  const contest = contests.find((c) => c.contestid == contestId);
  return new Date(contest.end_time).getTime();
}


module.exports = {
  getContestEnd,
};
