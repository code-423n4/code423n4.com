import React from "react";
import { graphql, Link } from "gatsby";

import DefaultLayout from "./DefaultLayout";
import SubmitFindings from "../components/reporter/SubmitFindings";

const ReportForm = (props) => {
  const endTime = props.data.contestsCsv.end_time;
  const hasContestEnded = Date.now() > new Date(endTime).getTime();

  return (
    <DefaultLayout>
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
        <SubmitFindings
          wardensList={props.data.allHandlesJson}
          sponsor={props.data.contestsCsv.sponsor.name}
          contest={props.data.contestsCsv.contestid}
          repo={props.data.contestsCsv.findingsRepo}
          title={props.data.contestsCsv.title}
        />
      )}
    </DefaultLayout>
  );
};

export default ReportForm;

export const pageQuery = graphql`
  query ContestsById($contestId: Int) {
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
