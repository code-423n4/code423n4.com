import React, { useMemo } from "react";
import { graphql } from "gatsby";

import DefaultLayout from "./DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

const SponsorLayout = (props) => {
  const pageTitle = `Sponsor ${props.pageContext.sponsorId}`;

  const resultData = useMemo(() => {
    let resultData = [];

    return resultData;
  });

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
      fields {
        contestPath
      }
      findings {
        finding
        handle {
          handle
        }
      }
    }
  }
}
`;
