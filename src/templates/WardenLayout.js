import React, { useMemo } from "react";
import { graphql } from "gatsby";

import DefaultLayout from "./DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

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
      break;
    case "3":
      data.highRisk += 1;
      break;
    case "g":
      data.gasOptz += 1;
      break;
    default:
      break;
  }
}

const WardenLayout = (props) => {
  const pageTitle = `Warden ${props.pageContext.wardenId}`;

  const resultData = useMemo(() => {
    let resultData = [];
    let contests = {};

    for (const finding of props.data.wardenFindings.findings) {
      if (!(finding.contest.contestid in contests)) {
        contests[finding.contest.contestid] = {
          title: `${finding.contest.title} - ${finding.contest.start_time}`,
          image: "",
          link: "",
          lowRisk: 0,
          medRisk: 0,
          highRisk: 0,
          nonCrit: 0,
          gasOptz: 0,
          allFindings: 0,
          awardTotal: 0,
        };
      }
      updateFindings(contests[finding.contest.contestid], finding);
    }

    for (let contestid in contests) {
      resultData.push(contests[contestid]);
    }

    return resultData;
  }, [props.data.wardenFindings]);

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="warden-page"
      preview=""
      pageDescription=""
    >
      <p>{props.pageContext.wardenId}</p>
      <LeaderboardTable results={resultData} mode="contest" />
    </DefaultLayout>
  );
};

export default WardenLayout;

export const query = graphql`
query WardenStatsQuery($wardenId: String) {
  wardenFindings: handlesJson(handle: {eq: $wardenId}) {
    handle
    findings {
      finding
      risk
      awardUSD
      contest {
        contestid
        title
        start_time
        fields {
          contestPath
        }
      }
    }
  }
}
`;
