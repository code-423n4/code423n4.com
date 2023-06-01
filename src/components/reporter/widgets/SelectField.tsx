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

interface SelectFieldProps {
  name: string;
  options: { label?: string; value: string | number; image?: unknown }[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isInvalid?: boolean;
  fieldState: string | number;
  required?: boolean;
  errorMessage?: string;
}

export default function SelectField({
  name,
  options,
  onChange,
  isInvalid,
  fieldState,
  required,
  errorMessage,
}: SelectFieldProps) {
  const handleChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : "";
      // create pseudo event object to enable using the same change handler for all inputs
      // @ts-ignore
      onChange({ target: { name, value } });
    },
    [onChange, name]
  );

  return (
    <>
      <Select
        name={name}
        aria-describedby={name}
        required={required}
        value={options.find((o) => o.value === fieldState) || "Select ..."}
        formatOptionLabel={SelectFieldOptionLabel}
        options={options}
        onChange={handleChange}
        className={clsx("ReactSelect", isInvalid && "input__input-error")}
        classNamePrefix="react-select"
      />
      {isInvalid && (
        <div id={name + "--error"} className={"form-field__error"}>
          {required &&
            !options.find((o) => o.value === fieldState) &&
            "This field is required"}
          {errorMessage && errorMessage}
        </div>
      )}
    </>
  );
}
