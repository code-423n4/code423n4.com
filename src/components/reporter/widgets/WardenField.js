import Avatar from "react-avatar";
import clsx from "clsx";
import React, { useCallback } from "react";

import Select from "react-select";

import * as styles from "./WardenField.module.scss";

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
  isInvalid,
  isMulti = false,
}) => {
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

  return (
    <>
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
      />
    </>
  );
};

export default WardenField;
