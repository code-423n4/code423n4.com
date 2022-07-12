import React, { ReactNode, useCallback, useState } from "react";
import clsx from "clsx";

import * as styles from "./Form.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
}

interface FormProps extends JSX.ElementChildrenAttribute {
  successMessage: string | ReactNode;
  onSubmit: () => Promise<void>;
  successButtonText?: string;
  title?: string;
  resetForm?: () => void;
  validator?: () => boolean;
  submitButtonText?: string;
  customSubmitComponent?: ReactNode;
}

const Form = ({
  children,
  title,
  successMessage,
  successButtonText,
  onSubmit,
  resetForm,
  validator,
  submitButtonText,
  customSubmitComponent,
}: FormProps) => {
  // Component State
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>(
    "An error occurred"
  );

  const handleReset = () => {
    resetForm && resetForm();
    setStatus(FormStatus.Unsubmitted);
  };

  const submit = async () => {
    if (validator) {
      const validationErrors = validator();
      if (validationErrors) {
        return;
      }
    }
    setStatus(FormStatus.Submitting);
    try {
      await onSubmit();
      setStatus(FormStatus.Submitted);
    } catch (error) {
      setErrorMessage(error);
      setStatus(FormStatus.Error);
    }
  };

  return (
    <div className={styles.Form}>
      {title && <h1 className={styles.Heading1}>{title}</h1>}
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <>
            {children}
            {customSubmitComponent ? (
              customSubmitComponent
            ) : (
              <button
                className="button cta-button centered"
                type="button"
                onClick={submit}
                disabled={status !== FormStatus.Unsubmitted}
              >
                {status === FormStatus.Unsubmitted
                  ? submitButtonText
                  : "Submitting..."}
              </button>
            )}
          </>
        </form>
      )}
      {status === FormStatus.Error && (
        <div className="centered-text">
          <h2 className={styles.Heading2}>Whoops!</h2>
          <p>{errorMessage}</p>
          <button
            className="button cta-button"
            type="button"
            onClick={() => setStatus(FormStatus.Unsubmitted)}
          >
            Try again
          </button>
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div className="centered-text">
          <h2 className={styles.Heading2}>Thank you!</h2>
          <p>{successMessage}</p>
          {successButtonText && (
            <button
              className="button cta-button"
              type="button"
              onClick={handleReset}
            >
              {successButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
