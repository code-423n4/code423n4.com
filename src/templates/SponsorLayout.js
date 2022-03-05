import React from "react";
import { graphql } from "gatsby";

import DefaultLayout from "./DefaultLayout";

const SponsorLayout = (props) => {
  const pageTitle = `Sponsor ${props.pageContext.sponsorId}`;

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="sponsor-page"
      preview=""
      pageDescription=""
    >
      <p>{props.pageContext.sponsorId}</p>
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