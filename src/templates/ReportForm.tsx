import { graphql, Link } from "gatsby";
import Moralis from "moralis";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

// types
import {
  Finding,
  FindingCreateRequest,
  FindingEditRequest,
} from "../../types/findings";

// hooks
import useUser from "../hooks/UserContext";

// components
import ProtectedPage from "../components/ProtectedPage";
import SubmitFindings from "../components/reporter/SubmitFindings";

export interface ReportState {
  title: string;
  risk: string;
  details: string;
  qaGasDetails: string;
  linksToCode: string[];
}

enum FormMode {
  Edit = "edit",
  Create = "create",
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
  const { currentUser } = useUser();

  const {
    sponsor,
    contestid,
    findingsRepo,
    title,
    end_time,
    fields,
  } = data.contestsCsv;
  const [state, setState] = useState<ReportState>(initialState);
  const [attributedTo, setAttributedTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<FormMode>(FormMode.Create);
  const [issueId, setIssueId] = useState<number>(0);
  const [findingId, setFindingId] = useState<string>(contestid);
  const [hasContestEnded, setHasContestEnded] = useState<boolean>(
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
    async (data: FindingCreateRequest): Promise<Response> => {
      const endpoint =
        mode === FormMode.Create ? "submit-finding" : "manage-findings";
      let requestData: FindingCreateRequest | FindingEditRequest = data;
      if (mode === FormMode.Edit) {
        requestData = getUpdatedFindingRequestData(data);
      }
      const user = await Moralis.User.current();
      if (!user) {
        throw "You must be logged in to submit findings";
      }
      const sessionToken = user.attributes.sessionToken;
      return fetch(`/.netlify/functions/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestData),
      });
    },
    // must include dependencies for functions executed by this function too
    [currentUser, mode, issueId, attributedTo, state]
  );

  const getUpdatedFindingRequestData = (
    data: FindingCreateRequest
  ): FindingEditRequest => {
    const requestData: FindingEditRequest = {
      issue: issueId!,
      contest: parseInt(data.contest),
      emailAddresses: data.emailAddresses,
    };
    if (state.title !== data.title) {
      requestData.title = data.title;
    }
    if (state.risk !== data.risk) {
      requestData.risk = { oldValue: state.risk, newValue: data.risk };
    }
    if (attributedTo !== data.attributedTo) {
      requestData.attributedTo = {
        oldValue: attributedTo,
        newValue: data.attributedTo,
        address: data.address,
      };
    }
    if (data.body !== state.qaGasDetails) {
      requestData.body = data.body;
    }

    // If nothing changed, do not submit
    if (
      !requestData.attributedTo &&
      !requestData.title &&
      !requestData.body &&
      !requestData.risk
    ) {
      throw "There were no changes to save.";
    }
    return requestData;
  };

  const initializeEditState = (finding) => {
    // normalize whitespace
    const normalizedBody = finding.body.replaceAll("\r\n", "\n");
    const { links, body } = separateLinksFromBody(normalizedBody, finding.risk);
    setMode(FormMode.Edit);
    setIssueId(parseInt(finding.issueNumber));
    setFindingId(`${contestid}-${finding.issueNumber}`);
    setState({
      title: finding.title,
      risk: finding.risk,
      details: body,
      qaGasDetails: normalizedBody,
      linksToCode: links,
    });
    setAttributedTo(finding.handle);
    setFindingId(`${contestid}-${finding.issueNumber}`);
  };

  const initializeCreateState = () => {
    setIssueId(0);
    setFindingId(contestid);
    setState(initialState);
    setMode(FormMode.Create);
    setAttributedTo(currentUser.username);
  };

  function findDiff(str1, str2) {
    let diff = "";
    str2.split("").forEach(function (val, i) {
      if (val != str1.charAt(i)) diff += val;
    });
    return diff;
  }

  useEffect(() => {
    (async () => {
      if (currentUser.isLoggedIn) {
        const user = await Moralis.User.current();

        if (location.state && location.state.finding) {
          const finding = location.state.finding;
          initializeEditState(finding);
        } else if (location.search) {
          const params = new URLSearchParams(location.search);
          const id = parseInt(params.get("issue") as string);
          if (!id) {
            initializeCreateState();
            return;
          }
          try {
            const q = new URLSearchParams({
              contest: contestid as string,
              issue: id.toString(),
            });
            const response = await fetch(
              `/.netlify/functions/manage-findings?` + q,
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Authorization": `Bearer ${user?.attributes.sessionToken}`,
                  "C4-User": currentUser.username,
                },
              }
            );
            const finding: Finding = await response.json();
            initializeEditState(finding);
          } catch (error) {
            // @todo: decide what should happen in this case? navigate back or load new finding
            toast.error(
              "An error occurred while fetching the details of your finding. Please refresh and try again"
            );
          }
        } else {
          initializeCreateState();
        }
        setIsLoading(false);
      }
    })();
  }, [currentUser, location, contestid]);

  const separateLinksFromBody = (
    issueBody: string,
    risk: string
  ): { links: string[]; body: string } => {
    let body = issueBody;
    let linksToCode: string[] = [];

    // @todo: extract lines of code from issue body for medium and high issues
    // body is generated with: # Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${details}\n\n
    if (["3 (High Risk)", "2 (Med Risk)"].includes(risk)) {
      const ltcEnd = body.indexOf("\n\n\n# Vulnerability details\n\n");

      if (ltcEnd >= 0) {
        linksToCode = linksToCode
          .concat(body.slice("# Lines of code\n\n".length, ltcEnd).split("\n"))
          .map((ltc) => ltc);
        body = body.slice(ltcEnd + "\n\n\n# Vulnerability details\n\n".length);
      }
    }
    return { links: linksToCode, body };
  };

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
          .{/* </p> */}
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
          sponsor={sponsor.name}
          contest={contestid}
          repo={findingsRepo}
          title={title}
          initialState={state}
          onSubmit={onSubmit}
          findingId={findingId}
          initialAttributedTo={attributedTo}
          submitButtonText={
            mode === FormMode.Create ? "Create Issue" : "Update Issue"
          }
          successMessage={
            mode === FormMode.Create
              ? "Your report has been submitted."
              : "Your report has been updated."
          }
          successButtonText={
            mode === FormMode.Create ? "Submit Another" : undefined
          }
          cancelButtonText={mode === FormMode.Edit ? "Undo Changes" : undefined}
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
  }
`;
