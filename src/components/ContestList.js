import React from "react";
import ContestTile from "./ContestTile";

const ContestList = ({ contests }) => {
  return (
    <>
      {contests.map((contest) => (
        <ContestTile
          contest={contest}
          key={contest.id}
        />
      ))}
    </>
  );
};

export default ContestList;
