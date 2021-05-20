import React from "react";
import { graphql } from "gatsby";
import Form from "../components/reporter/Form";

const ReportForm = (props) => {
  return (
    <div>
      <Form
        repoUrl={props.data.contestsCsv.findingsRepo}
        contest={props.data.contestsCsv.title}
        sponsor={props.data.contestsCsv.sponsor.name}
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
