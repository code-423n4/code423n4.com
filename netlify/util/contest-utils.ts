import csv from "csvtojson";


async function getContest(contestId) {
  const contests = await csv().fromFile("_data/contests/contests.csv");
  const contest = contests.find((c) => c.contestid == contestId);

  return contest;
}

function isContestActive(contestId) {
  return getContest(contestId).then((c) => {
    if (c) {
      const now = Date.now();
      const start = new Date(c.start_time).getTime();
      const end = new Date(c.end_time).getTime();
  
      return (now >= start) && (now <= end);
    }
    return false;
  });
}

export {
  getContest,
  isContestActive,
};
