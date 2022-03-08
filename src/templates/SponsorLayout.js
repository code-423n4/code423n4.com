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

const SponsorLayout = (props) => {
  const pageTitle = `Sponsor ${props.pageContext.sponsorId}`;

  const resultData = useMemo(() => {
    let resultData = [];

    for (const contest of props.data.contestFindings.contests) {
      let contestData = {
        title: `${contest.title} - ${contest.start_time}`,
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
      for (const finding of contest.findings) {
        updateFindings(contestData, finding);
      }
      resultData.push(contestData);
    }

    return resultData;
  }, [props.data.contestFindings]);

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="sponsor-page"
      preview=""
      pageDescription=""
    >
      <p>{props.pageContext.sponsorId}</p>
      <LeaderboardTable results={resultData} mode="contest" />
    </DefaultLayout>
  );
};

export default SponsorLayout;

export const query = graphql`
query SponsorStatsQuery($sponsorId: String) {
  contestFindings: orgsJson(name: {eq: $sponsorId}) {
    name
    contests {
      title
      start_time
      fields {
        contestPath
      }
      findings {
        finding
        risk
        awardUSD
        handle {
          handle
        }
      }
    }
  }
}
`;
