import Avatar from "react-avatar";
import clsx from "clsx";
import React, { useCallback, useState } from "react";

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

const WardenField = ({
  name,
  required,
  options,
  onChange,
  fieldState,
  validator,
  label = undefined,
  helpText = undefined,
  isMulti = false,
}) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleChange = useCallback(
    (option) => {
      // @todo: pass the option object itself to the onChange handler
      // and process the data in the consumer
      const value = option && option.value ? option.value : "";
      const target = {
        name,
        value: isMulti ? option : value,
      };
      onChange({ target });
    },
    [onChange, name, isMulti]
  );

  const validate = () => {
    let errorMessages = [];
    if (validator) {
      const validationErrors = validator(fieldState);
      if (validationErrors.length > 0) {
        errorMessages = errorMessages.concat(validationErrors);
      }
    }
    if (required && (fieldState === "" || fieldState === undefined)) {
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
          {label}
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
