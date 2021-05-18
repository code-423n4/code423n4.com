import React from "react";
import { graphql } from "gatsby";
import Form from "../components/reporter/Form";

const ReportForm = (props) => {
  return (
    <div>
      <Form
        repoUrl={props.data.contestsJson.repo}
        contest={props.data.contestsJson.title}
        sponsor={props.data.contestsJson.sponsor.name}
      />
    </div>
  );
};

export default ReportForm;

export const pageQuery = graphql`
  query ContestsById($contestId: Int) {
    contestsJson(contestid: { eq: $contestId }) {
      title
      contestid
      start_time
      end_time
      repo
      sponsor {
        name
      }
    }
  }
`;
