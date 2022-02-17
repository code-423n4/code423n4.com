import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";

import LeaderboardTable from "./LeaderboardTable";

const ContestResults = (data) => {
  // console.log(data);

  // const q = useStaticQuery(query);
  // console.log(q);

  const resultData = useMemo(() => {
    let result = [];

    return result;
  }, [data]);

  return (
    <LeaderboardTable results={resultData} />
  );
};

export default ContestResults;
