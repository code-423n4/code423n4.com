import clsx from "clsx";
import React, { useCallback } from "react";
import Select from "react-select";

const SelectFieldOptionLabel = ({ label }) => {
  return (
    <div>
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
      aria-describedby={name + "--error"}
      required={required}
      value={options.find((o) => o.value === fieldState) || "Select ..."}
      formatOptionLabel={SelectFieldOptionLabel}
      options={options}
      onChange={handleChange}
      className={clsx("ReactSelect", isInvalid && "WardenField__Invalid")}
      classNamePrefix="react-select"
    />
  );
};

export default SelectField;
