import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Agreement from "../content/Agreement.js";
import FormField from "./widgets/FormField";
import Widget from "./widgets/Widget";
import ContestWarning from "../content/ContestWarning.js";
import FindingContent from "./FindingContent.js";

import * as styles from "./Form.module.scss";
import * as widgetStyles from "./widgets/Widgets.module.scss";

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const Form = ({
  contest,
  sponsor,
  repoUrl,
  initialState,
  fieldsList,
  vulnerabilityDetailsField,
  qaGasDetailsField,
  updateLocalStorage,
  initStateFromStorage,
  handleSubmit,
  changeHandler,
}) => {
  // Component State
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isQaOrGasFinding, setIsQaOrGasFinding] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // fetch initial state from local storage
  useEffect(() => {
    initStateFromStorage(
      contest,
      sponsor,
      repoUrl,
      setState,
      setIsQaOrGasFinding
    );
  }, [contest, repoUrl, sponsor, initStateFromStorage]);

  // update local storage
  useEffect(() => {
    updateLocalStorage(state, contest);
  }, [state, contest, updateLocalStorage]);

  // Event Handlers
  const handleChange = (e) => {
    changeHandler(setState, e, setIsQaOrGasFinding);
  };

  // Submit handler
  const submitHandler = () => {
    handleSubmit(
      contest,
      state,
      isQaOrGasFinding,
      setHasValidationErrors,
      submitFinding,
      setIsExpanded
    );
  };

  // Reset form
  const handleReset = () => {
    setState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };

  // Generic submit
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
        <button onClick={() => setIsExpanded(!isExpanded)}>
          <img
            src={isExpanded ? "/images/compress.svg" : "/images/expand.svg"}
            alt={isExpanded ? "compress form" : "expand form"}
            className={clsx(styles.FormIcons)}
          />
        </button>
      </div>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <input type="hidden" id="contest" name="contest" value={contest} />
          <fieldset className={widgetStyles.Fields}>
            {/* TODO: refactor form fields; move FormField into individual field components */}
            {fieldsList.map((field, index) => {
              if (field.name === "title" && isQaOrGasFinding) {
                return "";
              } else {
                return (
                  <FormField
                    key={`${field.name} ${index}`}
                    name={field.name}
                    label={field.label}
                    helpText={field.helpText}
                    isInvalid={hasValidationErrors && !state[field.name]}
                  >
                    <Widget
                      field={field}
                      onChange={handleChange}
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
            onClick={submitHandler}
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
