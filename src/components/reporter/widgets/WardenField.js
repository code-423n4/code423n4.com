import React, { useCallback } from "react";
import clsx from "clsx";

import Select from "react-select";

import * as styles from "./WardenField.module.scss";
import * as baseStyles from "./Widgets.module.scss";

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

const WardenField = ({
  name,
  options,
  onChange,
  fieldState,
  isInvalid,
  isMulti = false,
}) => {
  const handleChange = useCallback(
    (option) => {
      if (!option) {
        onChange({ target: { name, value: "" } });
        return;
      }
      let value = option.value;
      if (isMulti) {
        value = option.map((o) => o.value);
      }
      onChange({ target: { name, value } });
    },
    [onChange, name, isMulti]
  );

  return (
    <>
      <Select
        name={name}
        required={required}
        value={options.find((o) => o.value === fieldState) || undefined}
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
