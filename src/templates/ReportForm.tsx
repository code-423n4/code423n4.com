import { graphql, Link } from "gatsby";
import Moralis from "moralis";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

// types
import { FindingCreateRequest, FindingEditRequest } from "../../types/findings";

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
  const [issueId, setIssueId] = useState<number | null>(null);
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
    [currentUser, mode]
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
      console.log("title changed:", state.title, "=>", data.title);
      requestData.title = data.title;
    }
    if (state.risk !== data.risk) {
      console.log("risk changed:", state.risk, "=>", data.risk);
      requestData.risk = { oldValue: state.risk, newValue: data.risk };
    }
    if (attributedTo !== data.attributedTo) {
      console.log(
        "attributedTo changed:",
        attributedTo,
        "=>",
        data.attributedTo
      );
      requestData.attributedTo = {
        oldValue: attributedTo,
        newValue: data.attributedTo,
        address: data.address,
      };
    }

    if (data.body !== state.qaGasDetails) {
      console.log("body changed:", state.qaGasDetails, "=>", data.body);
      requestData.body = data.body;
    }

    // check if anything changed
    if (
      !requestData.attributedTo &&
      !requestData.title &&
      !requestData.body &&
      !requestData.risk
    ) {
      console.log("error - no changes to save");
      throw "There were no changes to save.";
    }
    return requestData;
  };

  useEffect(() => {
    (async () => {
      if (currentUser.isLoggedIn) {
        const user = await Moralis.User.current();

        if (location.state && location.state.finding) {
          const finding = location.state.finding;
          const { links, body } = separateLinksFromBody(
            finding.body,
            finding.risk
          );
          setMode(FormMode.Edit);
          setIssueId(finding.issueNumber);
          setFindingId(`${contestid}-${finding.issueNumber}`);
          setState({
            title: finding.title,
            risk: finding.risk,
            details: body,
            qaGasDetails: finding.body,
            linksToCode: links,
          });
          setAttributedTo(finding.attributedTo);
          setIsLoading(false);
          // ? will this swap the endpoint on normal submit?
          setFindingId(`${contestid}-${finding.issueNumber}`);
        } else if (location.search) {
          try {
            const params = new URLSearchParams(location.search);
            const id = parseInt(params.get("issue") as string);
            // if id?
            // // placeholder function for getting issue by id;
            // // will need to reshape the response to be ReportState
            // // before passing into setting initial state
            setMode(FormMode.Edit);
            setIssueId(id);
            setFindingId(`${contestid}-${id}`);

            const q = new URLSearchParams({
              contest: contestid as string,
              issue: id.toString(),
            });

            fetch(`/.netlify/functions/manage-findings?` + q, {
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${user?.attributes.sessionToken}`,
                "C4-User": currentUser.username,
              },
            })
              .then((response) => response.json())
              .then((resultData) => {
                let linksToCode = [];
                let body = resultData.finding.body;
                if (
                  ["3 (High Risk)", "2 (Med Risk)"].includes(
                    resultData.finding.risk
                  )
                ) {
                  const ltcEnd = body.indexOf(
                    "\n\n\n# Vulnerability details\n\n"
                  );

                  if (ltcEnd >= 0) {
                    linksToCode = linksToCode.concat(
                      body
                        .slice("# Lines of code\n\n".length, ltcEnd)
                        .split("\n")
                    );
                    body = body.slice(ltcEnd + "\n\n\n".length);
                  }
                }

                setState({
                  title: resultData.finding.title,
                  risk: resultData.finding.risk,
                  details: body,
                  qaGasDetails: body,
                  linksToCode: linksToCode,
                });
                setAttributedTo(resultData.finding.attributedTo);
                // setState(resultData);
                // setIsLoading(false);
              })
              .catch(() => {
                //
              })
              .finally(() => {
                setIsLoading(false);
              });
          } catch (error) {
            // @todo: decide what should happen in this case? navigate back or load new finding
            toast.error(
              "An error occurred while fetching the details of your finding. Please refresh and try again"
            );
          }
        } else {
          setIssueId(0);
          setFindingId(contestid);
          setState(initialState);
          setIsLoading(false);
          setMode(FormMode.Create);
          setAttributedTo(currentUser.username);
        }
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
