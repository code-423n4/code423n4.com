import { graphql, Link } from "gatsby";
import Moralis from "moralis";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProtectedPage from "../components/ProtectedPage";
import SubmitFindings from "../components/reporter/SubmitFindings";

export interface ReportState {
  title: string;
  risk: string;
  details: string;
  qaGasDetails: string;
  linksToCode: string[];
}

export interface FindingRequestData {
  user: string;
  contest: string;
  sponsor: string;
  repo: string;
  emailAddresses: string[];
  attributedTo: string;
  address: string;
  risk: string;
  title: string;
  body: string;
  labels: string[];
  issueId?: string;
}

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## " +
  "Proof of Concept\nProvide direct links to all referenced code in GitHub. " +
  "Add screenshots, logs, or any other relevant proof that illustrates the concept." +
  "\n\n## Tools Used\n\n## Recommended Mitigation Steps";
const initialState: ReportState = {
  title: "",
  risk: "",
  details: mdTemplate,
  qaGasDetails: "",
  linksToCode: [""],
};

const ReportForm = ({ data, location }) => {
  const {
    sponsor,
    contestid,
    findingsRepo,
    title,
    end_time,
    fields,
  } = data.contestsCsv;
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [endpoint, setEndpoint] = useState("submit-finding");
  const [issueId, setIssueId] = useState("");
  const [findingId, setFindingId] = useState(contestid);
  const [hasContestEnded, setHasContestEnded] = useState(
    Date.now() > new Date(end_time).getTime()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const hasEnded = Date.now() > new Date(end_time).getTime();
      if (hasEnded) {
        clearInterval(timer);
      }
      setHasContestEnded(hasEnded);
    }, 1000);
    return () => clearInterval(timer);
  });

  const onSubmit = useCallback(
    async (data: FindingRequestData): Promise<Response> => {
      if (issueId) {
        data.issueId = issueId;
      }
      const url = `/.netlify/functions/${endpoint}`;
      const user = await Moralis.User.current();
      if (!user) {
        throw "You must be logged in to submit findings";
      }
      const sessionToken = user.attributes.sessionToken;
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });
    },
    [issueId, location.search, state]
  );

  useEffect(() => {
    (async () => {
      if (location.state && location.state.finding) {
        const finding = location.state.finding;
        setFindingId(finding.issueNumber);
        setState({
          title: finding.title,
          risk: finding.risk,
          details: finding.body,
          qaGasDetails: finding.body,
          linksToCode: finding.linksToCode,
        });
        setIsLoading(false);
        setEndpoint("manage-findings");
        setFindingId(`${contestid}-${finding.issueNumber}`);
      } else if (location.search) {
        try {
          // @todo: improve this
          const params = new URLSearchParams(location.search);
          const id = params.get("issue");
          // if id?
          // // placeholder function for getting issue by id;
          // // will need to reshape the response to be ReportState
          // // before passing into setting initial state
          // const issue = await getSubmission(issueId)
          // setState(issue);
          setIssueId(id as string);
          setFindingId(`${contestid}-${id}`);
          setEndpoint("manage-findings");
          setIsLoading(false);
        } catch (error) {
          // @todo: decide what should happen in this case? navigate back or load new finding
          toast.error(
            "An error occurred while fetching the details of your finding. Please refresh and try again"
          );
        }
      } else {
        setIssueId("");
        setFindingId(contestid);
        setState(initialState);
        setIsLoading(false);
        setEndpoint("submit-finding");
      }
    })();
  }, [location.search, contestid]);

  return (
    <ProtectedPage
      pageTitle="Submit finding | Code 423n4"
      message={
        <>
          You need to be a registered warden currently connected via wallet to
          see this page.
          {/* <p> */}
            If authentication isn't working, you may{" "}
            <Link to={fields.submissionPath + "-old"}>
              try the unauthenticated submission form
            </Link>
            .
          {/* </p> */}
        </>
      }
    >
      {isLoading ? (
        // @todo: style a loading state
        <span>Loading...</span>
      ) : hasContestEnded ? (
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
        // @todo: pass in dynamic submit button and cancel button
        // @todo: remove allHandlesJson dependency (and page query)
        <SubmitFindings
          wardensList={data.allHandlesJson}
          sponsor={sponsor.name}
          contest={contestid}
          repo={findingsRepo}
          title={title}
          initialState={state}
          onSubmit={onSubmit}
          findingId={findingId}
        />
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
