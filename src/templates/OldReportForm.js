import React from "react";
import { graphql, Link } from "gatsby";

import DefaultLayout from "../templates/DefaultLayout";
import OldSubmitFindings from "../components/reporter/OldSubmitFindings";

const OldReportForm = (props) => {
  const endTime = props.data.contestsCsv.end_time;
  const hasContestEnded = Date.now() > new Date(endTime).getTime();

  return (
    <DefaultLayout
      pageTitle={props.data.contestsCsv.title}
    >
      {hasContestEnded ? (
        <div className="center">
          <h1>This contest has ended.</h1>
          <p>You can no longer submit findings for this contest.</p>
          <Link
            to="/contests"
            className="contest-repo button button-small cta-button primary"
          >
            View active contests
          </Link>
        </div>
      ) : (
        <OldSubmitFindings
          wardensList={props.data.allHandlesJson}
          sponsor={props.data.contestsCsv.sponsor.name}
          contest={props.data.contestsCsv.contestid}
          repo={props.data.contestsCsv.findingsRepo}
        />
      )}
    </DefaultLayout>
  );
};

export default OldReportForm;

export const pageQuery = graphql`
  query OldReportFormContestsById ($contestId: Int) {
    contestsCsv(contestid: { eq: $contestId }) {
      title
      contestid
      start_time
      end_time
      findingsRepo
      sponsor {
        name
      }
    }
    allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          id
          handle
          image {
            childImageSharp {
              resize(width: 64, quality: 90) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
