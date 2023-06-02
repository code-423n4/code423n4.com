import React from "react";
import clsx from "clsx";

const TextField = ({
  name,
  required,
  fieldState,
  isInvalid,
  onChange,
  placeholder,
}) => {
  function handleChange(e) {
    onChange(e);
  }

  return (
    <input
      className={clsx(isInvalid && "input__input-error")}
      name={name}
      type="text"
      onChange={handleChange}
      required={required}
      value={fieldState}
      placeholder={placeholder}
      aria-describedby={name + "--error"}
    />
  );
};

export default TextField;
