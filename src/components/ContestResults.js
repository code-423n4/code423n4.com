import React, { useMemo } from "react";

import LeaderboardTable from "./LeaderboardTable";

function updateFindings(data, finding) {
  data.allFindings += 1;
  data.awardTotal += finding.awardUSD ?? 0;

  switch (finding.risk.toLowerCase()) {
    case "0":
      data.nonCrit += 1;
      break;
    case "1":
      data.lowRisk += 1;
      break;
    case "2":
      data.medRisk += 1;
      if (finding.split === 1) {
        data.soloMed += 1;
      }
      break;
    case "3":
      data.highRisk += 1;
      if (finding.split === 1) {
        data.soloHigh += 1;
      }
      break;
    case "g":
      data.gasOptz += 1;
      break;
    default:
      break;
  }
}

const ContestResults = ({ results }) => {
  const resultData = useMemo(() => {
    let resultData = [];
    let handles = {};

    for (const finding of results.findings) {
      if (!(finding.handle.handle in handles)) {
        const handleData = {
          handle: finding.handle.handle,
          image: finding.handle.image,
          link: finding.handle.link,
          members: finding.handle.members,
          lowRisk: 0,
          medRisk: 0,
          soloMed: 0,
          highRisk: 0,
          soloHigh: 0,
          nonCrit: 0,
          gasOptz: 0,
          allFindings: 0,
          awardTotal: 0,
        };
        handles[finding.handle.handle] = { ...handleData };
      }
      updateFindings(handles[finding.handle.handle], finding);
    }

    for (const handle in handles) {
      if (handles[handle].allFindings > 0) {
        resultData.push(handles[handle]);
      }
    }

    return resultData;
  }, [results]);

  return <LeaderboardTable results={resultData} />;
};

export default ContestResults;
