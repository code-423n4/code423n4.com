import React from "react";
import ContestTile from "./ContestTile";

const ContestList = ({ contests, updateContestStatus, user }) => {
  return (
    <>
      {contests.map((contest) => (
        <ContestTile
          contest={contest}
          key={contest.id}
          updateContestStatus={updateContestStatus}
          user={user}
        />
      ))}
    </>
  );
};

export default ContestList;
