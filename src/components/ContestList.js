import React from "react";
import Contest from "./Contest";

const ContestList = ({ contests }) => {
  console.log(contests);
  return (
    <>
      {contests.map((contest) => (
        <Contest contest={contest.node} key={contest.node.id} />
      ))}
    </>
  );
};

export default ContestList;
