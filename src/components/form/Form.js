import React, { useCallback, useState } from "react";
import clsx from "clsx";
import FormField from "../reporter/widgets/FormField";
import Widget from "../reporter/widgets/Widget";

import * as styles from "./Form.module.scss";
import * as widgetStyles from "../reporter/widgets/Widgets.module.scss";

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const Form = ({
  initialState,
  state,
  setState,
  fieldsList,
  handleSubmit,
  changeHandler,
  displayedInfo,
  resetForm,
  children,
}) => {
  // Component State
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset form
  const handleReset = () => {
    if (resetForm) {
      resetForm();
      setStatus(FormStatus.Unsubmitted);
      return;
    }
    setState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };

  // Generic submit
  const submitFinding = useCallback((url, data, headers) => {
    (async () => {
      setStatus(FormStatus.Submitting);
      const response = await fetch(
        url,
        headers || {
          method: "POST",
          headers: headers || { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
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
        <h1 className={styles.Heading1}>{displayedInfo.title}</h1>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(styles.FormIconButton)}
        >
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
          <fieldset className={widgetStyles.Fields}>
            {/* TODO: refactor form fields; move FormField into individual field components */}
            {fieldsList.map((field, index) => {
              let isInvalid = false;
              if (field.name === "linesOfCode") {
                isInvalid = hasValidationErrors;
              } else {
                isInvalid = hasValidationErrors && !state[field.name];
              }
              return (
                <FormField
                  key={`${field.name} ${index}`}
                  name={field.name}
                  label={field.label}
                  helpText={field.helpText}
                  isInvalid={isInvalid}
                >
                  <Widget
                    field={field}
                    onChange={changeHandler}
                    fieldState={state}
                    isInvalid={isInvalid}
                  />
                </FormField>
              );
            })}
          </fieldset>
          {children}
          <button
            className="button cta-button centered"
            type="button"
            onClick={() =>
              handleSubmit(setHasValidationErrors, submitFinding, setIsExpanded)
            }
            disabled={status !== FormStatus.Unsubmitted}
          >
            {status === FormStatus.Unsubmitted
              ? displayedInfo.buttonText
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
          <h2 className={styles.Heading2}>Thank you!</h2>
          <p>{displayedInfo.afterSubmit}</p>
          <button
            className="button cta-button"
            type="button"
            onClick={handleReset}
          >
            {displayedInfo.successButton}
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
