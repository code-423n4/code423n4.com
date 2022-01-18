import React, { useState } from "react";
import clsx from "clsx";
import * as styles from "./Widgets.module.scss";

const SelectField = ({ name, options, onChange, isInvalid }) => {
  const [value, setValue] = useState("")

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  }

  return (
    <select
      className={clsx(
        styles.Control,
        styles.Select,
        isInvalid && "input-error",
        value === "" && styles.Placeholder,
      )}
      name={name}
      onChange={handleChange}
    >
      <option value="">Select...</option>
      {options.map((option, index) => (
        <option key={"option-" + index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
