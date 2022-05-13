import React, { useCallback, useState } from "react";
import clsx from "clsx";
import Agreement from "../content/Agreement.js";
import FormField from "../reporter/widgets/FormField";
import Widget from "../reporter/widgets/Widget";
import FindingContent from "../reporter/FindingContent.js";

import * as styles from "./Form.module.scss";
import * as widgetStyles from "../reporter/widgets/Widgets.module.scss";

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const Form = ({
  // contest,
  initialState,
  state,
  setState,
  fieldsList,
  handleSubmit,
  changeHandler,
  checkQaOrGasFinding,
  displayedInfo,
}) => {
  // Component State
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset form --> CAN STAY
  const handleReset = () => {
    setState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };

  // Generic submit --> CAN STAY
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
        <h1>{displayedInfo.title}</h1>
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
          {/* not sure about the use of this one  */}
          {/* <input type="hidden" id="contest" name="contest" value={contest} /> */}
          <fieldset className={widgetStyles.Fields}>
            {/* TODO: refactor form fields; move FormField into individual field components */}
            {fieldsList.map((field, index) => {
              if (
                field.name === "title" &&
                (checkQaOrGasFinding(state.risk) || state.risk === "")
              ) {
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
                      onChange={changeHandler}
                      fieldState={state}
                      isInvalid={hasValidationErrors && !state[field.name]}
                    />
                  </FormField>
                );
              }
            })}

            {state.risk && (
              <FindingContent
                hasValidationErrors={hasValidationErrors}
                state={state}
                handleChange={changeHandler}
                isQaOrGasFinding={checkQaOrGasFinding(state.risk)}
              />
            )}
          </fieldset>

          <Agreement />

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
          <h1>Thank you!</h1>
          <p>{displayedInfo.afterSubmit}</p>
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
