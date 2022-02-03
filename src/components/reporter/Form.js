import React, { useCallback, useState } from "react";
import { StaticQuery, graphql } from "gatsby";
import clsx from "clsx";
import Agreement from "../content/Agreement.js";
import * as styles from "./Form.module.scss";
import LinesOfCode from "../reporter/LinesOfCodeInput.js";
import * as widgetStyles from "./widgets/Widgets.module.scss";
import { Widget } from "./widgets";
import FormField from "./widgets/FormField";

const config = {
  labelAll: "bug",
};

const emailField = {
  name: "email",
  label: "Email address",
  helpText: "Used to send a copy of this form for your records",
  widget: "text",
  required: true,
}

const addressField = {
  name: "address",
  label: "Polygon address",
  helpText:
    "Address where your prize should go to (and retroactive token reward should C4 be tokenized later). If you use a smart contract wallet, please contact one of our organizers in Discord in addition to adding the address here.",
  widget: "text",
  required: true,
}

const titleField = {
  name: "title",
  label: "Title",
  helpText:
    "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
  widget: "text",
  required: true,
}

const riskField = {
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
}

const vulnerabilityDetailsField = {
  name: "details",
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
}

const qaGasDetailsField = {
  name: "qaGasDetails",
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
}

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  title: "",
  email: "",
  handle: "",
  address: "",
  risk: "",
  details: mdTemplate,
  qaGasDetails: "",
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

const FindingContent = ({hasValidationErrors, state, handleChange, isGasFinding, isQaFinding}) => {
  return (
    isGasFinding || isQaFinding ? (
      <FormField
        name={qaGasDetailsField.name}
        label={qaGasDetailsField.label}
        helpText={qaGasDetailsField.helpText}
        isInvalid={hasValidationErrors && !state.qaGasDetails}
      >
        <Widget
          field={qaGasDetailsField}
          onChange={handleChange}
          fieldState={state}
          isInvalid={hasValidationErrors && !state.qaGasDetails}
        />
      </FormField>
    ) : (
      <>
        <FormField
          name={titleField.name}
          label={titleField.label}
          helpText={titleField.helpText}
          isInvalid={hasValidationErrors && !state.title}
        >
          <Widget
            field={titleField}
            onChange={handleChange}
            fieldState={state}
            isInvalid={hasValidationErrors && !state.title}
          />
        </FormField>
        <FormField
          name={vulnerabilityDetailsField.name}
          label={vulnerabilityDetailsField.label}
          helpText={vulnerabilityDetailsField.helpText}
          isInvalid={hasValidationErrors && !state.details}
        >
          <Widget
            field={vulnerabilityDetailsField}
            onChange={handleChange}
            fieldState={state}
            isInvalid={hasValidationErrors && !state.details}
          />
        </FormField>
      </>
    )
  )
}

const Form = ({ contest, sponsor, repoUrl }) => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isQaFinding, setIsQaFinding] = useState(false);
  const [isGasFinding, setGasMessage] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const handleRiskChange = useCallback((e) => {
    handleChange(e);
    const { value } = e.target;
      if (value.slice(0, 1) === "G") {
        console.log('GAS')
        setGasMessage(true);
        setIsQaFinding(false);
      } else if (value.slice(0, 1) === '1' || value.slice(0, 1) === '0') {
        console.log('LOW')
        setIsQaFinding(true);
        setGasMessage(false);
      } else {
        console.log('HIGH OR MED')
        setIsQaFinding(false);
        setIsQaFinding(false);
      }
  }, [state, isQaFinding, isGasFinding]);

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

  const details = isGasFinding || isQaFinding ? state.qaGasDetails : state.details;

  const markdownBody = `# Handle\n\n${state["handle"]}\n\n\n# Vulnerability details\n\n${details}\n\n`;

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

                <LinesOfCode />

                <fieldset className={widgetStyles.Fields}>
                  {/* TODO: refactor form fields; move FormField into individual field components */}
                  <FormField
                    name="handle"
                    label="Handle"
                    helpText="Handle you're competing under (individual or team name)"
                    isInvalid={hasValidationErrors && !state.handle}
                  >
                    <Widget
                      field={{
                        name: "handle",
                        label: "Handle",
                        helpText: "Handle you're competing under (individual or team name)",
                        widget: "warden",
                        required: true,
                        options: wardens,
                      }}
                      onChange={handleChange}
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state.handle}
                    />
                  </FormField>
                  <FormField
                    name={emailField.name}
                    label={emailField.label}
                    helpText={emailField.helpText}
                    isInvalid={hasValidationErrors && !state.email}
                  >
                    <Widget
                      field={emailField}
                      onChange={handleChange}
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state.email}
                    />
                  </FormField>
                  <FormField
                    name={addressField.name}
                    label={addressField.label}
                    helpText={addressField.helpText}
                    isInvalid={hasValidationErrors && !state.address}
                  >
                    <Widget
                      field={addressField}
                      onChange={handleChange}
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state.address}
                    />
                  </FormField>
                  {isQaFinding && (
                    <div>
                      <p className="warning-message">
                        👋 Hi there! We've changed the way we are handling low risk,
                        and non-critical findings. Please submit all low
                        risk and non critical findings as one report. Submissions for medium and
                        high risk findings are not changing. Check out{" "}
                        <a href="">the FAQ</a> for more details.
                      </p>
                    </div>
                  )}
                  {isGasFinding && (
                    <div>
                      <p className="warning-message">
                        👋 Hi there! We've changed the way we are handling gas optimization findings.
                        Please submit all gas optimization as one report.
                        Submissions for medium and high risk findings are not changing. Check out{" "}
                        <a href="">the FAQ</a> for more details.
                      </p>
                    </div>
                  )}
                  <FormField
                    name={riskField.name}
                    label={riskField.label}
                    helpText={riskField.helpText}
                    isInvalid={hasValidationErrors && !state.risk}
                  >
                    <Widget
                      field={riskField}
                      onChange={handleRiskChange}
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state.risk}
                    />
                  </FormField>
                  {state.risk && (
                    <FindingContent
                      hasValidationErrors={hasValidationErrors}
                      state={state}
                      handleChange={handleChange}
                      isGasFinding={isGasFinding}
                      isQaFinding={isQaFinding}
                    />
                  )}
                </fieldset>
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
