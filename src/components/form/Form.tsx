import clsx from "clsx";
import React, { ReactNode, useState } from "react";

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
  title?: string | ReactNode;
  subtitle?: string;
  resetForm?: () => void;
  validator?: () => boolean;
  submitButtonText?: string | ReactNode;
  className?: string;
}

const Form = ({
  children,
  title,
  subtitle,
  successMessage,
  successButtonText,
  onSubmit,
  resetForm,
  validator,
  submitButtonText,
  className,
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
    <div className={clsx("form", className && className)}>
      {title && <h1 className="type__headline__page-title">{title}</h1>}
      {subtitle && <h2 className="type__subline__l">{subtitle}</h2>}
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <>
            {children}
            <div className="form__submit-button-holder">
              <button
                className="button button--primary form__submit-button"
                type="button"
                onClick={submit}
                disabled={status !== FormStatus.Unsubmitted}
              >
                {status === FormStatus.Unsubmitted &&
                  (submitButtonText || "Submit")}
                {status === FormStatus.Submitting && "Submitting..."}
              </button>
            </div>
          </>
        </form>
      )}
      {status === FormStatus.Error && (
        <>
          <h2>Sorry, an error has occurred.</h2>
          <p>{errorMessage}</p>
          <button
            className="button button--primary form__submit-button"
            type="button"
            onClick={() => setStatus(FormStatus.Unsubmitted)}
          >
            Try again
          </button>
        </>
      )}
      {status === FormStatus.Submitted && (
        <>
          <h2>Thank you!</h2>
          <p>{successMessage}</p>
          {successButtonText && (
            <button
              className="button button--primary form__submit-button"
              type="button"
              onClick={handleReset}
            >
              {successButtonText}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Form;
