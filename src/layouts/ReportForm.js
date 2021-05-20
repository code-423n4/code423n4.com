import React from "react";
import { graphql } from "gatsby";
import Form from "../components/reporter/Form";

const ReportForm = (props) => {
  return (
    <div>
      <Form
        repoUrl={props.data.contestsJson.findingsRepo}
        contest={props.data.contestsJson.title}
        sponsor={props.data.contestsJson.sponsor.name}
      />
    </div>
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
