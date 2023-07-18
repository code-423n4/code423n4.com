import Avatar from "react-avatar";
import clsx from "clsx";
import React, { ReactNode, useCallback, useState } from "react";

import Select from "react-select";

const WardenOptionLabel = ({ value, image }) => {
  return (
    <div className={"warden-field__option-container"}>
      <Avatar
        src={image?.childImageSharp?.resize?.src || ""}
        name={value}
        size="27px"
        round="27px"
        className="warden-field__avatar"
      />
      <span>{value}</span>
    </div>
  );
};

export interface WardenFieldOption {
  value: string;
  image: unknown;
}

interface WardenFieldProps<T> {
  name: string;
  required?: boolean;
  options: WardenFieldOption[];
  onChange: (e: { target: { value: T; name: string } }) => void;
  fieldState: T;
  validator?: (value: T) => (string | ReactNode)[];
  label?: string;
  helpText?: string;
  isMulti?: boolean;
}

const WardenField = ({
  name,
  required = false,
  options,
  onChange,
  fieldState,
  validator,
  label,
  helpText,
  isMulti = false,
}: WardenFieldProps<WardenFieldOption[] | string>) => {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    (string | ReactNode)[]
  >([]);

  const handleChange = useCallback(
    (option) => {
      // @todo: pass the option object itself to the onChange handler
      // and process the data in the consumer instead of trying to
      // reshape into a change event type
      const value = option && option.value ? option.value : "";
      const target: {
        value: WardenFieldOption[] | string;
        name: string;
      } = {
        name,
        value: isMulti ? option : value,
      };
      onChange({ target });
    },
    [onChange, name, isMulti]
  );

  const validate = () => {
    let errorMessages: (string | ReactNode)[] = [];
    if (validator) {
      const validationErrors = validator(fieldState);
      if (validationErrors.length > 0) {
        errorMessages = errorMessages.concat(validationErrors);
      }
    }
    if (required && !fieldState) {
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
      {label && <label htmlFor={name}>{required ? label + " *" : label}</label>}
      {helpText && <p className="form__help-text">{helpText}</p>}
      <Select
        name={name}
        aria-describedby={name}
        required={required}
        value={
          isMulti
            ? fieldState
            : options.find((o) => o.value === fieldState) || undefined
        }
        formatOptionLabel={WardenOptionLabel}
        options={options}
        onChange={handleChange}
        className={clsx("react-select", isInvalid && "warden-field__invalid")}
        classNamePrefix="react-select"
        isClearable={true}
        isMulti={isMulti}
        onBlur={validate}
      />
      {isInvalid &&
        validationErrors.map((validationError) => (
          <p id={name} className={"input__error-message form-field__error"}>
            {validationError}
          </p>
        ))}
    </div>
  );
};

export default WardenField;
