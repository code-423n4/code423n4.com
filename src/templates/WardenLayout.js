import React, { useMemo } from "react";
import { graphql } from "gatsby";

import DefaultLayout from "./DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

const WardenLayout = (props) => {
  const pageTitle = `Warden ${props.pageContext.wardenId}`;

  const resultData = useMemo(() => {
    let resultData = [];

    return resultData;
  });

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
  contestFindings: handlesJson(handle: {eq: $wardenId}) {
    handle
    findings {
      finding
      contest {
        title
        fields {
          contestPath
        }
      }
    }
  }
}
`;
