import React from "react";
import { graphql, Link } from "gatsby";

import DefaultLayout from "./DefaultLayout";
import Form from "../components/reporter/Form";

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
        <Form
          repoUrl={props.data.contestsCsv.findingsRepo}
          contest={props.data.contestsCsv.contestid}
          sponsor={props.data.contestsCsv.sponsor.name}
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
  }
`;
