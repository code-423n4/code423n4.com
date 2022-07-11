import clsx from "clsx";
import React, { ReactNode, useState } from "react";

import * as styles from "./Input.module.scss";

// @todo: replace TextField widgets with this component

interface InputProps {
  name: string;
  label?: string | ReactNode;
  helpText?: string | ReactNode;
  required?: boolean;
  value: string;
  canRemove?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputField?: (name: string) => void;
  // optional button to show on the right of the input
  button?: string;
  handleButtonClick?: (value: string) => void;
  // returns an array of error messages
  validator?: (value: string) => (string | ReactNode)[];
}

export function Input({
  name,
  label,
  helpText,
  required,
  value,
  canRemove = false,
  handleChange,
  handleRemoveInputField = undefined,
  validator,
  button,
  handleButtonClick,
}: InputProps) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const validate = (): void => {
    let errorMessages = [];
    if (validator) {
      const validationErrors = validator(value);
      if (validationErrors.length > 0) {
        errorMessages = errorMessages.concat(validationErrors);
      }
    }
    if (required && (value === "" || value === undefined)) {
      errorMessages.push("This field is required");
    }
    if (errorMessages.length > 0) {
      setIsInvalid(true);
      setValidationErrors(errorMessages);
    } else {
      setIsInvalid(false);
      setValidationErrors([]);
    }
  };

  return (
    <div>
      {label && (
        <label className={styles.Label} htmlFor={name}>
          {label}
        </label>
      )}
      {helpText && <p className={styles.Help}>{helpText}</p>}
      <div className={styles.InputWrapper}>
        <input
          className={clsx(
            styles.Control,
            styles.Text,
            isInvalid && styles.InputError
          )}
          name={name}
          type="text"
          value={value}
          autoComplete="off"
          onBlur={validate}
          onChange={handleChange}
        />
        {canRemove && (
          <button
            className={styles.DeleteButton}
            type="button"
            onClick={() => handleRemoveInputField(name)}
            aria-label="Remove this field"
          >
            &#x2715;
          </button>
        )}
        {button && handleButtonClick && (
          <button
            //className="button button-tiny secondary"
            className={styles.DeleteButton}
            type="button"
            onClick={() => handleButtonClick(value)}
          >
            {button}
          </button>
        )}
      </div>
      {isInvalid &&
        validationErrors.map((validationError) => (
          <label htmlFor={name} className={styles.ErrorMessage}>
            {validationError}
          </label>
        ))}
    </div>
  );
}
