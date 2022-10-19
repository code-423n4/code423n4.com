import clsx from "clsx";
import React, { useCallback } from "react";
import Select from "react-select";

import * as formStyles from "./WardenField.module.scss";

const SelectFieldOptionLabel = ({ label }) => {
  return (
    <div className={formStyles.OptionContainer}>
      <span>{label}</span>
    </div>
  );
};

const SelectField = ({
  name,
  options,
  onChange,
  isInvalid,
  fieldState,
  required,
}) => {
  const handleChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : "";
      onChange({ target: { name, value } });
    },
    [onChange, name]
  );

  return (
    <Select
      name={name}
      required={required}
      value={options.find((o) => o.value === fieldState) || "Select ..."}
      formatOptionLabel={SelectFieldOptionLabel}
      options={options}
      onChange={handleChange}
      className={clsx(formStyles.ReactSelect, isInvalid && formStyles.Invalid)}
      classNamePrefix="react-select"
    />
  );
};

export default SelectField;
