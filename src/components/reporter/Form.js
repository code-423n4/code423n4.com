import React, { useCallback, useState } from "react";
import { StaticQuery, graphql } from "gatsby";
import clsx from "clsx";
import Agreement from "../content/Agreement.js";
import * as styles from "./Form.module.scss";
import { Widgets } from "./widgets";

const config = {
  labelAll: "bug",
  fields: [
    {
      name: "handle",
      label: "Handle",
      helpText: "Handle you're competing under (individual or team name)",
      widget: "warden",
      required: true,
      options: [],
    },
    {
      name: "email",
      label: "Email address",
      helpText: "Used to send a copy of this form for your records",
      widget: "text",
      required: true,
    },
    {
      name: "address",
      label: "Polygon address",
      helpText:
        "Address where your prize should go to (and retroactive token reward should C4 be tokenized later). If you use a smart contract wallet, please contact one of our organizers in Discord in addition to adding the address here.",
      widget: "text",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      helpText:
        "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
      widget: "text",
      required: true,
    },
    {
      name: "risk",
      label: "Risk rating",
      widget: "select",
      required: true,
      options: [
        {
          label: "0 — Gas Optimization",
          value: "G (Gas Optimization)",
        },
        {
          label: "0 — Non-critical",
          value: "0 (Non-critical)",
        },
        {
          label: "1 — Low Risk",
          value: "1 (Low Risk)",
        },
        {
          label: "2 — Medium Risk",
          value: "2 (Med Risk)",
        },
        {
          label: "3 — High Risk",
          value: "3 (High Risk)",
        },
      ],
    },
    {
      name: "details",
      label: "Vulnerability details",
      helpText: "Link to all referenced sections of code in GitHub",
      widget: "textarea",
      required: true,
    },
  ],
};
const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  title: "",
  email: "",
  handle: "",
  address: "",
  risk: "",
  details: mdTemplate,
};

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const wardensQuery = graphql`
  query Wardens {
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

const Form = ({ contest, sponsor, repoUrl }) => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");

  const fields = config.fields;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const url = `/.netlify/functions/submit-finding`;

  const submitFinding = useCallback((url, data) => {
    (async () => {
      setStatus(FormStatus.Submitting);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus(FormStatus.Submitted);
      } else {
        setStatus(FormStatus.Error);
        const message = await response.json();
        if (message) {
          setErrorMessage(message);
        }
      }
    })();
  }, []);

  const markdownBody = `# Handle\n\n${state["handle"]}\n\n\n# Vulnerability details\n\n${state["details"]}\n\n`;

  const labelSet = [config.labelAll, state.risk ? state.risk : ""];

  const repo = repoUrl.split("/").pop();

  const formData = {
    contest,
    sponsor,
    repo,
    email: state.email,
    handle: state.handle,
    address: state.address,
    risk: state.risk ? state.risk.slice(0, 1) : "",
    title: state.title,
    body: markdownBody,
    labels: labelSet,
  };

  const handleSubmit = () => {
    // extract required fields from field data for validation check
    const { email, handle, address, risk, title, body } = formData;
    const errors = [email, handle, address, risk, title, body].some((field) => {
      return field === "" || field === undefined;
    });
    setHasValidationErrors(Boolean(errors));
    if (!errors) {
      submitFinding(url, formData);
    }
  };

  const handleReset = () => {
    setState({
      ...state,
      title: "",
      details: mdTemplate,
    });
    setStatus(FormStatus.Unsubmitted);
  };

  return (
    <StaticQuery
      query={wardensQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });
        fields[0].options = wardens;

        return (
          <div className={clsx(styles.Form)}>
            <h1>{sponsor} contest finding</h1>
            {(status === FormStatus.Unsubmitted ||
              status === FormStatus.Submitting) && (
              <form>
                <input
                  type="hidden"
                  id="contest"
                  name="contest"
                  value={contest}
                />
                <Widgets
                  fields={fields}
                  onChange={handleChange}
                  fieldState={state}
                  showValidationErrors={hasValidationErrors}
                />
                <Agreement />
                <button
                  className="button cta-button centered"
                  type="button"
                  onClick={handleSubmit}
                  disabled={status !== FormStatus.Unsubmitted}
                >
                  {status === FormStatus.Unsubmitted
                    ? "Create issue"
                    : "Submitting..."}
                </button>
              </form>
            )}
            {status === FormStatus.Error && (
              <div>
                <p>{errorMessage}</p>
              </div>
            )}
            {status === FormStatus.Submitted && (
              <div className="centered-text">
                <h1>Thank you!</h1>
                <p>Your report has been submitted.</p>
                <button
                  className="button cta-button"
                  type="button"
                  onClick={handleReset}
                >
                  Submit another
                </button>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default Form;
