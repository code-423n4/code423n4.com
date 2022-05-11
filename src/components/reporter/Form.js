import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Agreement from "../content/Agreement.js";
import FormField from "./widgets/FormField";
import Widget from "./widgets/Widget";
import ContestWarning from "../content/ContestWarning.js";
import FindingContent from "./FindingContent.js";

import * as styles from "./Form.module.scss";
import * as widgetStyles from "./widgets/Widgets.module.scss";

const config = {
  labelAll: "bug",
};

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
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

const Form = ({
  contest,
  sponsor,
  repoUrl,
  initialState,
  fieldsList,
  vulnerabilityDetailsField,
  qaGasDetailsField,
  submissionUrl,
  updateLocalStorage,
}) => {
  // Component State
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isQaOrGasFinding, setIsQaOrGasFinding] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
  const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
  const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;
  const labelSet = [config.labelAll, state.risk ? state.risk : ""];

  // fetch initial state from local storage
  useEffect(() => {
    if (typeof window !== `undefined`) {
      const dataObject = JSON.parse(window.localStorage.getItem(contest));
      let riskIndex = null;

      if (dataObject && dataObject.risk !== "") {
        riskIndex = fieldsList[3].options.findIndex(
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
        risk: riskIndex !== null ? fieldsList[3].options[riskIndex].value : "",
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
      if (riskIndex !== null && fieldsList[3].options[riskIndex].value) {
        fieldsList[3].options[riskIndex].value.slice(0, 1) === "G" ||
        fieldsList[3].options[riskIndex].value.slice(0, 1) === "Q"
          ? setIsQaOrGasFinding(true)
          : setIsQaOrGasFinding(false);
      }
    }
  }, [contest, repoUrl, sponsor, initialState.mdTemplate]); // if add labelSet --> infinite loop

  // update local storage
  useEffect(() => {
    updateLocalStorage(state, contest)
  }, [state, contest]);

  // Event Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "polygonAddress") {
      setState((state) => {
        return { ...state, address: value };
      });
    } else {
      setState((state) => {
        return { ...state, [name]: value };
      });
    }
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
      submitFinding(submissionUrl, { ...state, body: formatedBody }); // make sure state is correctly submited
      if (typeof window !== `undefined`) {
        window.localStorage.removeItem(contest);
      }
      setIsExpanded(false);
    }
  };
  
  // !! CAN STAY
  const handleReset = () => {
    setState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };


  // !! CAN STAY
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
    <div
      className={
        !isExpanded ? clsx(styles.Form) : clsx(styles.Form, styles.FormMax)
      }
    >
      <div className={clsx(styles.FormHeader)}>
        <h1>{sponsor} contest finding</h1>
        <img
          src={isExpanded ? "/images/compress.svg" : "/images/expand.svg"}
          alt={isExpanded ? "compress form" : "expand form"}
          className={clsx(styles.FormIcons)}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <input type="hidden" id="contest" name="contest" value={contest} />
          <fieldset className={widgetStyles.Fields}>
            {/* TODO: refactor form fields; move FormField into individual field components */}
            {fieldsList.map((field) => {
              if (field.name === "title" && isQaOrGasFinding) {
                return;
              } else {
                return (
                  <FormField
                    name={field.name}
                    label={field.label}
                    helpText={field.helpText}
                    isInvalid={hasValidationErrors && !state[field.name]}
                  >
                    <Widget
                      field={field}
                      onChange={
                        field.name === "risk" ? handleRiskChange : handleChange
                      }
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state[field.name]}
                    />
                  </FormField>
                );
              }
            })}

            {isQaOrGasFinding && <ContestWarning />}

            {state.risk && (
              <FindingContent
                hasValidationErrors={hasValidationErrors}
                state={state}
                handleChange={handleChange}
                handleLocChange={handleLocChange}
                isQaOrGasFinding={isQaOrGasFinding}
                qaGasDetailsField={qaGasDetailsField}
                vulnerabilityDetailsField={vulnerabilityDetailsField}
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
};

export default Form;
