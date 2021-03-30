import React from "react";
import Contest from "./Contest";

const ContestList = ({ contests }) => {
  return (
    <>
      {contests.reverse().map((contest) => (
        <Contest contest={contest.node} key={contest.node.id} />
      ))}
    </>
  );
};

export default ContestList;
