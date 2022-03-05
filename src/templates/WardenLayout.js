import React from "react";
import { graphql } from "gatsby";

import DefaultLayout from "./DefaultLayout";

const WardenLayout = (props) => {
  const pageTitle = `Warden ${props.pageContext.wardenId}`;
  
  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="warden-page"
      preview=""
      pageDescription=""
    >
      <p>{props.pageContext.wardenId}</p>
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
