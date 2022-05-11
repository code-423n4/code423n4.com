import React from "react";
import { graphql, Link } from "gatsby";

import Form from "../components/reporter/Form";

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  contest: "",
  sponsor: "",
  repo: "",
  title: "",
  email: "",
  handle: "",
  polygonAddress: "",
  risk: "",
  details: mdTemplate,
  qaGasDetails: "",
  linesOfCode: [
    {
      id: Date.now(),
      value: "",
    },
  ],
};

const wardenField = (wardens) => {
  return {
    name: "handle",
    label: "Handle",
    helpText: "Handle you're competing under (individual or team name)",
    widget: "warden",
    required: true,
    options: wardens,
  };
};

const emailField = {
  name: "email",
  label: "Email address",
  helpText: "Used to send a copy of this form for your records",
  widget: "text",
  required: true,
};

const addressField = {
  name: "address", // was polygonAddress before
  label: "Polygon address",
  helpText:
    "Address where your prize should go. If you use a smart contract wallet, please contact one of our organizers in Discord in addition to adding the address here.",
  widget: "text",
  required: true,
};

const titleField = {
  name: "title",
  label: "Title",
  helpText:
    "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
  widget: "text",
  required: true,
};

const riskField = {
  name: "risk",
  label: "Risk rating",
  widget: "select",
  required: true,
  options: [
    {
      label: "Gas Optimizations",
      value: "G (Gas Optimization)",
    },
    {
      label: "QA Report (low / non-critical)",
      value: "QA (Quality Assurance)",
    },
    {
      label: "Medium Risk",
      value: "2 (Med Risk)",
    },
    {
      label: "High Risk",
      value: "3 (High Risk)",
    },
  ],
};

const vulnerabilityDetailsField = {
  name: "details",
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
};

const qaGasDetailsField = {
  name: "qaGasDetails",
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
};

const submissionUrl = `/.netlify/functions/submit-finding`;

const updateLocalStorage = (state, contest) => {
  if (typeof window !== `undefined`) {
    window.localStorage.setItem(contest, JSON.stringify(state));
  }
};

const checkTitle = (title, risk) => {
  if (risk === "G (Gas Optimization)") {
    return "Gas Optimizations";
  } else if (risk === "QA (Quality Assurance)") {
    return "QA Report";
  } else {
    return title;
  }
};

const handleSubmit = (
  contest,
  state,
  isQaOrGasFinding,
  details,
  markdownBody,
  setHasValidationErrors,
  submitFinding,
  setIsExpanded
) => {
  // extract required fields from field data for validation check
  const formatedRisk = state.risk ? state.risk.slice(0, 1) : "";
  const formatedTitle = checkTitle(state.title, state.risk);
  const formatedBody = isQaOrGasFinding ? details : markdownBody;
  const { email, handle, address } = state;
  const requiredFields = isQaOrGasFinding
    ? [email, handle, address, formatedRisk, formatedBody]
    : [email, handle, address, formatedRisk, formatedTitle, formatedBody];
  let hasErrors = requiredFields.some((field) => {
    return field === "" || field === undefined;
  });

  // TODO: verify that loc include code lines and are valid URLs
  if (!isQaOrGasFinding && !state.linesOfCode[0].value) {
    hasErrors = true;
  }

  const regex = new RegExp("#L", "g");
  const hasInvalidLinks = state.linesOfCode.some((line) => {
    return !regex.test(line.value);
  });

  setHasValidationErrors(hasErrors || hasInvalidLinks);
  if (!hasErrors) {
    submitFinding(submissionUrl, { ...state, body: formatedBody }); //!! make sure state is correctly submited
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem(contest);
    }
    console.log({ ...state, body: formatedBody });
    setIsExpanded(false);
  }
};

const initStateFromStorage = (
  contest,
  sponsor,
  repoUrl,
  labelSet,
  setState,
  setIsQaOrGasFinding
) => {
  if (typeof window !== `undefined`) {
    const dataObject = JSON.parse(window.localStorage.getItem(contest));
    let riskIndex = null;

    if (dataObject && dataObject.risk !== "") {
      riskIndex = riskField.options.findIndex(
        (element) => element.value === dataObject.risk
      );
    }

    setState({
      contest: contest,
      sponsor: sponsor,
      repo: repoUrl.split("/").pop(),
      labels: labelSet,
      title: dataObject?.title || "",
      email: dataObject?.email || "",
      handle: dataObject?.handle || "",
      address: dataObject?.address || "",
      risk: riskIndex !== null ? riskField.options[riskIndex].value : "",
      details: dataObject?.details || initialState.details,
      qaGasDetails: dataObject?.qaGasDetails || "",
      linesOfCode:
        dataObject?.linesOfCode && dataObject?.linesOfCode.length > 0
          ? dataObject?.linesOfCode
          : [
              {
                id: Date.now(),
                value: "",
              },
            ],
    });
    if (riskIndex !== null && riskField.options[riskIndex].value) {
      riskField.options[riskIndex].value.slice(0, 1) === "G" ||
      riskField.options[riskIndex].value.slice(0, 1) === "Q"
        ? setIsQaOrGasFinding(true)
        : setIsQaOrGasFinding(false);
    }
  }
};

const changeHandler = (setState, e, setIsQaOrGasFinding) => {
  if (Array.isArray(e)) {
    setState((state) => {
      return { ...state, linesOfCode: e };
    });
  } else {
    const { name, value } = e?.target;
    switch (name) {
      case "risk":
        const riskLevel = value.slice(0, 1);
        if (riskLevel === "G" || riskLevel === "Q") {
          setIsQaOrGasFinding(true);
        } else {
          setIsQaOrGasFinding(false);
        }
        setState((state) => {
          return { ...state, [name]: value };
        });
        break;
      default:
        setState((state) => {
          return { ...state, [name]: value };
        });
        break;
    }
  }
};

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
