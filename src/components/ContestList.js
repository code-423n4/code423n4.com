import React from "react";
import Contest from "./ContestTile";

const ContestList = ({ contests }) => {
  return (
    <>
      {contests.map((contest) => (
        <Contest contest={contest} key={contest.node.id} />
      ))}
    </>
  );
};

export default ContestList;
