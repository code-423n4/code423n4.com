import { getTimeRemaining, getDates } from "./time";
import { sortByContestStart } from "./sort";

function contestsByState({ contests }, gracePeriod) {
  console.log(gracePeriod);
  const filteredContests = {
    active: contests.filter(
      (c) =>
        getDates(c.node.start_time, c.node.end_time, gracePeriod).state ===
          "active" ||
        getDates(c.node.start_time, c.node.end_time, gracePeriod).inGracePeriod
    ),
    soon: contests.filter(
      (c) =>
        getDates(c.node.start_time, c.node.end_time, gracePeriod).state ===
        "soon"
    ),
    completed: contests
      .filter(
        (c) =>
          getDates(c.node.start_time, c.node.end_time, gracePeriod).state ===
          "completed"
      )
      .sort(sortByContestStart("reverse")),
  };
  return filteredContests;
}

export { contestsByState };
