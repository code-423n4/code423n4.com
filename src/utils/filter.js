import { getDates } from "./time";
import { sortByContestStart } from "./sort";

function contestsByState({ contests, data }) {
  // console.log("status from filter",status);
  const filteredContests = {
    active: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).contestStatus === "active"
    ),
    soon: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).contestStatus === "soon"
    ),
    completed: contests
      .filter(
        (c) =>
          getDates(c.node.start_time, c.node.end_time).contestStatus === "completed"
      )
      .sort(sortByContestStart("reverse")),
  };

  return filteredContests;
}

export { contestsByState };
