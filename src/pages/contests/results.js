import React, { useMemo } from "react";
import { graphql } from "gatsby";

import LeaderboardTable from "../../components/LeaderboardTable";

const ContestResults = (data) => {  
  const resultData = useMemo(() => {
    let result = [];

    return result;
  }, [data]);

  return (
    <LeaderboardTable results={resultData} />
  );
};

export default ContestResults;
