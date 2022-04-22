import React, { useCallback, useState, useEffect } from "react";
import { StaticQuery, graphql, Link } from "gatsby";
import clsx from "clsx";

import Agreement from "../content/Agreement.js";
import FormField from "./widgets/FormField";
import LinesOfCode from "../reporter/LinesOfCodeInput.js";
import Widget from "./widgets/Widget";

import * as styles from "./Form.module.scss";
import * as widgetStyles from "./widgets/Widgets.module.scss";

import useUser from "../../hooks/UserContext";

const config = {
  labelAll: "bug",
};

const emailField = {
  name: "email",
  label: "Email address",
  helpText: "Used to send a copy of this form for your records",
  widget: "text",
  required: true,
};

const addressField = {
  name: "polygonAddress",
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

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
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

const FindingContent = ({
  hasValidationErrors,
  state,
  handleChange,
  handleLocChange,
  isQaOrGasFinding,
}) => {
  return isQaOrGasFinding ? (
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
      <LinesOfCode
        onChange={handleLocChange}
        linesOfCode={state.linesOfCode}
        hasValidationErrors={hasValidationErrors}
      />
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
  );
};

const Form = ({ contest, sponsor, repoUrl }) => {
  // Component State
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isQaOrGasFinding, setIsQaOrGasFinding] = useState(false);

  const { currentUser } = useUser();
  const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
  const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
  const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;
  const labelSet = [config.labelAll, state.risk ? state.risk : ""];
  const submissionUrl = `/.netlify/functions/submit-finding`;
  let title = "";
  if (state.risk === "G (Gas Optimization)") {
    title = "Gas Optimizations";
  } else if (state.risk === "QA (Quality Assurance)") {
    title = "QA Report";
  } else {
    title = state.title;
  }

  useEffect(() => {
    (() => {
      if (currentUser.isLoggedIn) {
        setState((prevState) => {
          return {
            ...prevState,
            handle: currentUser.username,
            polygonAddress: currentUser.address,
          };
        });
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            handle: "",
            polygonAddress: "",
          };
        });
      }
    })();
  }, [currentUser.isLoggedIn]);

  const formData = {
    contest,
    sponsor,
    repo: repoUrl.split("/").pop(),
    email: state.email,
    handle: state.handle,
    address: state.polygonAddress,
    risk: state.risk ? state.risk.slice(0, 1) : "",
    title,
    body: isQaOrGasFinding ? details : markdownBody,
    labels: labelSet,
  };

  // Event Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const handleLocChange = useCallback((linesOfCode) => {
    setState((state) => {
      return { ...state, linesOfCode };
    });
  }, []);

  const handleRiskChange = useCallback(
    (e) => {
      handleChange(e);
      const riskLevel = e.target.value.slice(0, 1);
      if (riskLevel === "G" || riskLevel === "Q") {
        setIsQaOrGasFinding(true);
      } else {
        setIsQaOrGasFinding(false);
      }
    },
    [handleChange]
  );

  const handleSubmit = () => {
    // extract required fields from field data for validation check
    const { email, handle, address, risk, title, body } = formData;
    const requiredFields = isQaOrGasFinding
      ? [email, handle, address, risk, body]
      : [email, handle, address, risk, title, body];
    let hasErrors = requiredFields.some((field) => {
      return field === "" || field === undefined;
    });

    const regex = new RegExp("#L", "g");
    const hasInvalidLinks = state.linesOfCode.some((line) => {
      return !regex.test(line.value);
    });

    if (!isQaOrGasFinding && (!state.linesOfCode[0].value || hasInvalidLinks)) {
      hasErrors = true;
    }

    setHasValidationErrors(hasErrors);
    if (!hasErrors) {
      submitFinding(submissionUrl, formData);
    }
  };

  const handleReset = () => {
    setState({
      ...state,
      title: "",
      details: mdTemplate,
      linesOfCode: [
        {
          id: Date.now(),
          value: "",
        },
      ],
    });
    setStatus(FormStatus.Unsubmitted);
  };

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
                <fieldset className={widgetStyles.Fields}>
                  {/* TODO: refactor form fields; move FormField into individual field components */}
                  <FormField
                    name="handle"
                    label="Handle"
                    helpText={
                      !currentUser.isLoggedIn && (
                        <>
                          Handle you're competing under (individual or team
                          name)
                          <br />
                          Don't see your handle?{" "}
                          <Link to="/register">Click here</Link> to register.
                        </>
                      )
                    }
                    isInvalid={hasValidationErrors && !state.handle}
                  >
                    {/* @todo: add help text for changing handle */}
                    {currentUser.isLoggedIn ? (
                      <span
                        className={clsx(
                          widgetStyles.Control,
                          widgetStyles.Text
                        )}
                      >
                        {state.handle}
                      </span>
                    ) : (
                      <Widget
                        field={{
                          name: "handle",
                          label: "Handle",
                          widget: "warden",
                          required: true,
                          options: wardens,
                        }}
                        onChange={handleChange}
                        fieldState={state}
                        isInvalid={hasValidationErrors && !state.handle}
                      />
                    )}
                  </FormField>
                  <FormField
                    name={addressField.name}
                    label={addressField.label}
                    helpText={!currentUser.isLoggedIn && addressField.helpText}
                    isInvalid={hasValidationErrors && !state.polygonAddress}
                  >
                    {/* @todo: add help text for changing address */}
                    {currentUser.isLoggedIn ? (
                      <span
                        className={clsx(
                          widgetStyles.Control,
                          widgetStyles.Text
                        )}
                      >
                        {state.polygonAddress}
                      </span>
                    ) : (
                      <input
                        className={clsx(
                          widgetStyles.Control,
                          widgetStyles.Text,
                          hasValidationErrors &&
                            !state.polygonAddress &&
                            "input-error"
                        )}
                        name={addressField.name}
                        type="text"
                        onChange={handleChange}
                        required={true}
                        value={state.polygonAddress}
                        data-form-type="other"
                      />
                    )}
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
                  {isQaOrGasFinding && (
                    <div>
                      <p className="warning-message">
                        👋 Hi there! We've changed the way we are handling low
                        risk, non-critical, and gas optimization findings.
                        Please submit all low risk and non critical findings as
                        one report, and gas optimization findings as another,
                        separate report. Submissions for medium and high risk
                        findings are not changing. Check out
                        <a
                          href="https://docs.code4rena.com/roles/wardens/judging-criteria"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="the docs (opens in a new window)"
                        >
                          {" "}
                          the docs
                        </a>{" "}
                        and
                        <a
                          href="https://docs.code4rena.com/roles/wardens/qa-gas-report-faq"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="FAQ about QA and Gas Reports (opens in a new window)"
                        >
                          {" "}
                          FAQ about QA and Gas Reports
                        </a>{" "}
                        for more details.
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
                      handleLocChange={handleLocChange}
                      isQaOrGasFinding={isQaOrGasFinding}
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
