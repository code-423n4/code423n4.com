import clsx from "clsx";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

// @todo: replace TextField widgets with this component

interface InputProps {
  name: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  maxLength?: number;
  label?: string | ReactNode;
  helpText?: string | ReactNode;
  canRemove?: boolean;
  toggleEdit?: boolean;
  // optional button to show after the input
  button?: string;
  forceValidation?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputField?: (name: string) => void;
  handleButtonClick?: (value: string) => void;
  handleSaveInputValue?: (name: string, value: string) => void;
  // returns an array of error messages
  validator?: (value: string) => (string | ReactNode)[];
}

export function Input({
  name,
  value,
  required,
  placeholder,
  disabled,
  type,
  maxLength,
  label,
  helpText,
  canRemove = false,
  toggleEdit,
  button,
  forceValidation,
  handleChange,
  handleRemoveInputField,
  handleButtonClick,
  handleSaveInputValue,
  validator,
}: InputProps) {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    (string | ReactNode)[]
  >([]);

  useEffect(() => {
    if (forceValidation) {
      validate();
    }
  }, [forceValidation]);

  const validate = (): (string | ReactNode)[] => {
    let errorMessages: (string | ReactNode)[] = [];
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
    return errorMessages;
  };

  const handleEditOrSaveClick = () => {
    if (!isEditing) {
      setIsEditing((prevState) => !prevState);
      return;
    }

    if (handleSaveInputValue) {
      const errorMessages = validate();
      if (errorMessages.length > 0) {
        return;
      }
      handleSaveInputValue(name, value);
      setIsEditing(false);
    }
  };

  return (
    <fieldset className="input">
      {label && (
        <label className={"input__label"} htmlFor={name}>
          {required ? label + " *" : label + " (Optional)"}
        </label>
      )}
      {helpText && <p className={"input__help"}>{helpText}</p>}
      <div className={"input__input-wrapper"}>
        <input
          className={clsx(
            "input__control",
            "input__text",
            isInvalid && "input__input-error"
          )}
          name={name}
          aria-describedby={name + "--error"}
          placeholder={placeholder || ""}
          type={type || "text"}
          value={value}
          autoComplete="off"
          onBlur={validate}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled || (toggleEdit && !isEditing)}
        />
        {canRemove && handleRemoveInputField && (
          <button
            className="input__suffix-button button button--secondary"
            type="button"
            onClick={() => handleRemoveInputField(name)}
            aria-label="Remove this field"
          >
            &#x2715;
          </button>
        )}
        {toggleEdit && handleSaveInputValue && (
          <button
            type="button"
            onClick={handleEditOrSaveClick}
            aria-label="Edit this field"
            className={clsx(
              "input__suffix-button",
              "button",
              isEditing ? "button--primary" : "button--secondary"
            )}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        )}
        {button && handleButtonClick && (
          <button
            className="input__suffix-button button button--secondary"
            type="button"
            onClick={() => handleButtonClick(value)}
          >
            {button}
          </button>
        )}
      </div>
      {isInvalid &&
        validationErrors.map((validationError) => (
          <div id={name + "--error"} className={"form-field__error"}>
            {validationError}
          </div>
        ))}
    </fieldset>
  );
}
