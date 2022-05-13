import React from "react";
import { graphql, Link } from "gatsby";
import {
  emailField,
  addressField,
  titleField,
  riskField,
  vulnerabilityDetailsField,
  qaGasDetailsField,
} from "../utils/submitFindingsUtils/fields";
import { initialState } from "../utils/submitFindingsUtils/state";
import {
  wardenField,
  updateLocalStorage,
  handleSubmit,
  initStateFromStorage,
  changeHandler,
  checkQaOrGasFinding
} from "../utils/submitFindingsUtils/functions";
import Form from "../components/reporter/Form";

const ReportForm = (props) => {
  const endTime = props.data.contestsCsv.end_time;
  const hasContestEnded = Date.now() > new Date(endTime).getTime();
  const wardens = props.data.allHandlesJson.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });

  return (
    <main>
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
          initialState={initialState}
          fieldsList={[
            wardenField(wardens),
            emailField,
            addressField,
            riskField,
            titleField,
          ]}
          vulnerabilityDetailsField={vulnerabilityDetailsField}
          qaGasDetailsField={qaGasDetailsField}
          updateLocalStorage={updateLocalStorage}
          initStateFromStorage={initStateFromStorage}
          handleSubmit={handleSubmit}
          changeHandler={changeHandler}
          formType={"report"}
          checkQaOrGasFinding={checkQaOrGasFinding}
        />
      )}
    </main>
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
