import React, { useMemo } from "react";

import LeaderboardTable from "./LeaderboardTable";

function computeResults(findings) {
  const results = {
    lowRisk: 0,
    medRisk: 0,
    highRisk: 0,
    nonCrit: 0,
    gasOptz: 0,
    allFindings: 0,
    awardTotal: 0,
  };

  findings.forEach((f) => {
    results.allFindings += 1;
    results.awardTotal += f.awardUSD ?? 0;

    switch (f.risk.toLowerCase()) {
      case "0":
        results.nonCrit += 1;
        break;
      case "1":
        results.lowRisk += 1;
        break;
      case "2":
        results.medRisk += 1;
        break;
      case "3":
        results.highRisk += 1;
        break;
      case "g":
        results.gasOptz += 1;
        break;
      default:
        break;
    }
  });

  return results;
}

const ContestResults = ({ handles }) => {
  const resultData = useMemo(() => {
    let result = [];

    for (const handle of handles) {
      let p = handle.node;

      const handleData = {
        handle: p.handle,
        image: p.image,
        link: p.link,
        members: p.members,
        lowRisk: 0,
        medRisk: 0,
        highRisk: 0,
        nonCrit: 0,
        gasOptz: 0,
        allFindings: 0,
        awardTotal: 0,
      };

      const combinedData = { ...handleData, ...computeResults(p.findings) };
      if (combinedData.allFindings > 0) {
        result.push(combinedData);
      }
    }

    return result;
  }, [handles]);

  return (
    <LeaderboardTable results={resultData} />
  );
};

export default ContestResults;
