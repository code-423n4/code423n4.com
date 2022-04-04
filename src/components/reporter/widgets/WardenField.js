import React, { useCallback } from "react";
import clsx from "clsx";

import Select from "react-select";

import * as styles from "./WardenField.module.scss";

const WardenOptionLabel = ({ value, image }) => {
  return (
    <div className={styles.OptionContainer}>
      <img
        src={
          image
            ? image.childImageSharp.resize.src
            : "https://placekitten.com/g/64/64"
        }
        alt={"avatar for " + value}
      />
      <span>{value}</span>
    </div>
  );
};

const WardenField = ({ options, onChange, fieldState, isInvalid }) => {
  const handleChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : "";
      onChange({ target: { name: "handle", value } });
    },
    [onChange]
  );

  return (
    <>
      <Select
        value={options.find((o) => o.value === fieldState) || undefined}
        formatOptionLabel={WardenOptionLabel}
        options={options}
        onChange={handleChange}
        className={clsx(styles.ReactSelect, isInvalid && styles.Invalid)}
        classNamePrefix="react-select"
        isClearable={true}
      />
    </>
  );
};

export default WardenField;
