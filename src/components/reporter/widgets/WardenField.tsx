import Avatar from "react-avatar";
import clsx from "clsx";
import React, { ReactNode, useCallback, useState } from "react";

import Select from "react-select";

import * as styles from "./WardenField.module.scss";
import * as inputStyles from "../../Input.module.scss";

const WardenOptionLabel = ({ value, image }) => {
  return (
    <div className={styles.OptionContainer}>
      <Avatar
        src={image ? image.childImageSharp.resize.src : ""}
        name={value}
        size="27px"
        round="27px"
        className={styles.Avatar}
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
      {label && (
        <label className={inputStyles.Label} htmlFor={name}>
          {required ? label + " *" : label}
        </label>
      )}
      {helpText && <p className={inputStyles.Help}>{helpText}</p>}
      <Select
        name={name}
        required={required}
        value={
          isMulti
            ? fieldState
            : options.find((o) => o.value === fieldState) || undefined
        }
        formatOptionLabel={WardenOptionLabel}
        options={options}
        onChange={handleChange}
        className={clsx(styles.ReactSelect, isInvalid && styles.Invalid)}
        classNamePrefix="react-select"
        isClearable={true}
        isMulti={isMulti}
        onBlur={validate}
      />
      {isInvalid &&
        validationErrors.map((validationError) => (
          <label htmlFor={name} className={inputStyles.ErrorMessage}>
            {validationError}
          </label>
        ))}
    </div>
  );
};

export default WardenField;
