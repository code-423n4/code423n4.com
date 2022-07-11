import React from "react";
import { graphql, Link } from "gatsby";

import SubmitFindings from "../components/reporter/SubmitFindings";
import ProtectedPage from "../components/ProtectedPage";

const ReportForm = (props) => {
  const endTime = props.data.contestsCsv.end_time;
  const hasContestEnded = Date.now() > new Date(endTime).getTime();

  const mdTemplate =
    "## Impact\nDetailed description of the impact of this finding.\n\n## " +
    "Proof of Concept\nProvide direct links to all referenced code in GitHub. " +
    "Add screenshots, logs, or any other relevant proof that illustrates the concept." +
    "\n\n## Tools Used\n\n## Recommended Mitigation Steps";
  const initialState = {
    title: "",
    risk: "",
    details: mdTemplate,
    qaGasDetails: "",
    linesOfCode: [""],
  };

  return (
    <ProtectedPage
      pageTitle="Submit finding | Code 423n4"
      message={
        <>
          You need to be a registered warden currently connected via wallet to
          see this page.
          <p>
            If authentication isn't working, you may{" "}
            <Link to={props.data.contestsCsv.fields.submissionPath + "-old"}>
              try the unauthenticated submission form
            </Link>
            .
          </p>
        </>
      }
    >
      {hasContestEnded ? (
        <div className="center">
          <h1>This contest has ended.</h1>
          <p>You can no longer submit findings for this contest.</p>
          <Link
            to="/contests"
            className="contest-repo button cta-button primary"
          >
            View active contests
          </Link>
        </div>
      ) : (
        <>
          Need to make a change to a submission?{" "}
          <Link
            to="/my/findings"
            state={{ contestId: props.data.contestsCsv.contestid }}
          >
            View submissions.
          </Link>
          <SubmitFindings
            wardensList={props.data.allHandlesJson}
            sponsor={props.data.contestsCsv.sponsor.name}
            contest={props.data.contestsCsv.contestid}
            repo={props.data.contestsCsv.findingsRepo}
            title={props.data.contestsCsv.title}
            initialState={initialState}
          />
        </>
      )}
    </ProtectedPage>
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
      fields {
        submissionPath
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
