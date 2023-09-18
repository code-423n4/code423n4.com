import { graphql, Link } from "gatsby";
import Moralis from "moralis-v1";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

// types
import {
  Finding,
  FindingCreateRequest,
  FindingDeleteRequest,
  FindingEditRequest,
  MitigationStatus,
} from "../../types/finding";

// hooks
import useUser from "../hooks/UserContext";

// components
import ProtectedPage from "../components/ProtectedPage";
import SubmitFindings from "../components/reporter/SubmitFindings";
import { AbsoluteURL, ReportId, RiskLabelName } from "../../types/shared";
import MitigationReviewSubmissionForm from "../components/reporter/MitigationReviewSubmissionForm";

export interface ReportState {
  title: string;
  risk: RiskLabelName | "";
  details: string;
  qaGasDetails: string;
  linksToCode: AbsoluteURL[];
  issueType: string;
}

export interface MitigationReviewSubmissionState {
  title: string;
  risk: RiskLabelName | "";
  details: string;
  linksToCode: AbsoluteURL[];
  issueType: string;
  mitigationOf: ReportId;
  mitigationStatus: MitigationStatus;
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
  issueType: "",
};

const initialMRSubmissionState: MitigationReviewSubmissionState = {
  title: "",
  risk: "",
  details: "",
  linksToCode: [""],
  mitigationOf: "",
  mitigationStatus: MitigationStatus.MitigationConfirmed,
  issueType: "",
};

const ReportForm = ({ data, location }) => {
  // data
  const {
    sponsor,
    contestid,
    findingsRepo,
    title,
    end_time,
    fields,
  } = data.contestsCsv;

  // hooks
  const { currentUser } = useUser();

  // state
  const [state, setState] = useState<ReportState>(initialState);
  const [
    mitigationReviewState,
    setMitigationReviewState,
  ] = useState<MitigationReviewSubmissionState>(initialMRSubmissionState);
  const [attributedTo, setAttributedTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<FormMode>(FormMode.Create);
  const [issueId, setIssueId] = useState<number>(0);
  const [findingId, setFindingId] = useState<string>(contestid);
  const [isClosed, setIsClosed] = useState<boolean>(false);
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
        requestData =
          fields.type === "Mitigation review"
            ? getUpdatedMitigationFindingRequestData(data)
            : getUpdatedFindingRequestData(data);
      }
      const user = await Moralis.User.current();
      if (!user) {
        throw "You must be logged in to submit or edit findings";
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

  const getUpdatedMitigationFindingRequestData = (
    data: FindingCreateRequest
  ): FindingEditRequest => {
    const requestData: FindingEditRequest = {
      issue: issueId!,
      contest: data.contest,
      emailAddresses: data.emailAddresses,
      risk: { oldValue: mitigationReviewState.risk, newValue: data.risk },
      attributedTo: {
        oldValue: attributedTo,
        newValue: data.attributedTo,
        address: data.address,
      },
      issueType: {
        newValue: data.issueType!,
        oldValue: mitigationReviewState.issueType,
      },
      mitigationOf: data.mitigationOf
        ? {
            newValue: data.mitigationOf!,
            oldValue: mitigationReviewState.mitigationOf,
          }
        : undefined,
      mitigationStatus: {
        newValue: data.mitigationStatus!,
        oldValue: mitigationReviewState.mitigationStatus,
      },
      body: data.body,
    };

    if (mitigationReviewState.title !== data.title) {
      requestData.title = data.title;
    }

    // If nothing changed, do not submit
    if (
      requestData.attributedTo.newValue === requestData.attributedTo.oldValue &&
      requestData.risk.newValue === requestData.risk.oldValue &&
      !requestData.title &&
      !requestData.body
    ) {
      throw "There were no changes to save.";
    }
    return requestData;
  };

  const getUpdatedFindingRequestData = (
    data: FindingCreateRequest
  ): FindingEditRequest => {
    const requestData: FindingEditRequest = {
      issue: issueId!,
      contest: data.contest,
      emailAddresses: data.emailAddresses,
      risk: { oldValue: state.risk, newValue: data.risk },
      attributedTo: {
        oldValue: attributedTo,
        newValue: data.attributedTo,
        address: data.address,
      },
      issueType: {
        newValue: data.issueType!,
        oldValue: state.issueType,
      },
    };

    if (state.title !== data.title) {
      requestData.title = data.title;
    }
    if (data.body !== state.qaGasDetails) {
      requestData.body = data.body;
    }

    // If nothing changed, do not submit
    if (
      requestData.attributedTo.newValue === requestData.attributedTo.oldValue &&
      requestData.risk.newValue === requestData.risk.oldValue &&
      !requestData.title &&
      !requestData.body
    ) {
      throw "There were no changes to save.";
    }
    return requestData;
  };

  const onDelete = useCallback(async (): Promise<void> => {
    const user = await Moralis.User.current();
    if (!user) {
      throw "You must be logged in to withdraw findings";
    }
    const sessionToken = user.attributes.sessionToken;
    const q = new URLSearchParams({
      contest: contestid.toString(),
      issue: issueId.toString(),
    });
    const body: FindingDeleteRequest = {
      attributedTo,
      risk: state.risk,
      emailAddresses: [currentUser.emailAddress],
    };
    const response = await fetch(`/.netlify/functions/manage-findings?` + q, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
        "C4-User": currentUser.username,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const { error } = await response.json();
      throw error;
    }
  }, [issueId, currentUser, state.risk, attributedTo]);

  const initializeEditState = (finding: Finding) => {
    if (finding.state === "CLOSED") {
      setIsClosed(true);
    }
    // normalize whitespace
    const normalizedBody = finding.body.replace(/\r\n/g, "\n");
    const { links, body } = separateLinksFromBody(normalizedBody, finding.risk);
    const { issueType, newBody } = separateIssueTypeFromBody(body);

    setMode(FormMode.Edit);
    setIssueId(finding.issueNumber);
    setFindingId(`${contestid}-${finding.issueNumber}`);
    fields.type === "Mitigation review"
      ? setMitigationReviewState({
          title: finding.title,
          risk: finding.risk,
          details: newBody,
          linksToCode: links.length > 0 ? links : [""],
          mitigationStatus: finding.mitigationStatus,
          mitigationOf: finding.mitigationOf || "",
          issueType: issueType || "",
        })
      : setState({
          title: finding.title,
          risk: finding.risk,
          details: newBody,
          qaGasDetails: normalizedBody,
          linksToCode: links,
          issueType: issueType || "",
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

  useEffect(() => {
    (async () => {
      if (currentUser.isLoggedIn) {
        const user = await Moralis.User.current();
        if (location.state && location.state.finding) {
          const finding = location.state.finding;
          initializeEditState(finding);
        } else if (location.search) {
          const params = new URLSearchParams(location.search);
          const id = params.get("issue");
          if (!id) {
            initializeCreateState();
            return;
          }
          try {
            const q = new URLSearchParams({
              contest: contestid,
              issue: id,
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

    // extract lines of code from issue body for medium and high issues
    // body is generated with: # Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${details}
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

  const separateIssueTypeFromBody = (
    issueBody: string
  ): { issueType: string; newBody: string } => {
    let newBody = issueBody;
    let issueType: string = "";
    const itcEnd = newBody.length;
    if (!issueBody.includes("## Assessed type")) {
      return { issueType: issueType, newBody };
    } else if (itcEnd >= 0) {
      const issueTypeArray = newBody
        .slice("\n\n\n## Assessed type\n\n".length, itcEnd)
        .split("\n");
      issueType = issueTypeArray[issueTypeArray.length - 1];
      const index = newBody.lastIndexOf("## Assessed type");
      if (index >= 0) {
        newBody = newBody.substring(0, index);
      } else {
        newBody = newBody;
      }
    }
    return { issueType: issueType, newBody };
  };

  return (
    <ProtectedPage pageTitle="Submit finding | Code4rena">
      {isLoading ? (
        // @todo: style a loading state
        <span>Loading...</span>
      ) : hasContestEnded ? (
        <div>
          <h1>This contest has ended.</h1>
          <p>You can no longer submit findings for this contest.</p>
          <Link to="/contests" className="button button--primary">
            View active contests
          </Link>
        </div>
      ) : isClosed ? (
        <div className={"form__form"}>
          <h1>This finding has been withdrawn</h1>
          <h3>Submitted by:</h3>
          <ul>
            <li>{attributedTo}</li>
          </ul>
          <h3>Finding:</h3>
          <ul>
            <li>Risk: {state.risk}</li>
            <li>Title: {state.title}</li>
            <li>Details: {state.qaGasDetails}</li>
          </ul>
        </div>
      ) : fields.type === "Mitigation review" ? (
        <MitigationReviewSubmissionForm
          sponsor={sponsor.name}
          contest={parseInt(contestid)}
          contestPath={fields.contestPath}
          repo={findingsRepo}
          title={title}
          initialState={mitigationReviewState}
          onSubmit={onSubmit}
          findingId={findingId}
          submitButtonText={
            mode === FormMode.Create ? "Create Issue" : "Update Issue"
          }
          successMessage={
            mode === FormMode.Create
              ? "Your report has been submitted."
              : "Your report has been updated."
          }
        />
      ) : (
        <SubmitFindings
          sponsor={sponsor.name}
          contest={parseInt(contestid)}
          contestPath={fields.contestPath}
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
          onDelete={mode === FormMode.Edit ? onDelete : undefined}
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
        contestPath
        type
      }
    }
  }
`;
