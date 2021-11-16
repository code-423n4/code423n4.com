import { getTimeRemaining, getDates } from "./time";
import { sortByContestStart } from "./sort";

function contestsByState({ contests }) {
  const filteredContests = {
    active: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).state === "active"
    ),
    soon: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).state === "soon"
    ),
    completed: contests
      .filter(
        (c) =>
          getDates(c.node.start_time, c.node.end_time).state === "completed"
      )
      .sort(sortByContestStart("reverse")),
  };
  return filteredContests;
}

export { contestsByState };
