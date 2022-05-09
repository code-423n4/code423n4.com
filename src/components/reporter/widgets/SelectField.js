import React, { useState, useEffect } from "react";
import clsx from "clsx";

import * as styles from "./Widgets.module.scss";

const SelectField = ({ name, options, onChange, isInvalid, fieldState }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (fieldState !== "") {
      setValue(fieldState);
    }
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <select
      className={clsx(
        styles.Control,
        styles.Select,
        isInvalid && "input-error",
        value === null && styles.Placeholder
      )}
      name={name}
      onChange={handleChange}
    >
      <option value="" selected={(value === null) ?? "selected"} >Select...</option>
      {options.map((option, index) => (
        <option
          key={"option-" + index}
          value={option.value}
          selected={value !== null ?? "selected"}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
