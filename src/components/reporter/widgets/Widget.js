import React from "react";

import { SelectField, TextArea, TextField } from "./";
import LinesOfCode from "../LinesOfCodeInput";
import WardenField from "./WardenField";

const Widget = ({ field, fieldState, isInvalid, onChange }) => {
  const { widget, name, required, options, maxSize = 65536, helpText = null } = field;

  function handleChange(e) {
    onChange(e);
  }

  const textFieldWidget = (
    <TextField
      name={name}
      required={required}
      onChange={handleChange}
      fieldState={fieldState[name]}
      isInvalid={isInvalid}
    />
  );

  const textAreaWidget = (
    <TextArea
      name={name}
      required={required}
      onChange={handleChange}
      fieldState={fieldState[name]}
      isInvalid={isInvalid}
      maxSize={maxSize}
      helpText={helpText}
    />
  );

  const selectFieldWidget = (
    <SelectField
      name={name}
      required={required}
      onChange={handleChange}
      options={options}
      fieldState={fieldState[name]}
      isInvalid={isInvalid}
    />
  );

  const wardenFieldWidget = (
    <WardenField
      name={name}
      required={required}
      onChange={handleChange}
      options={options}
      fieldState={fieldState[name]}
      isInvalid={isInvalid}
    />
  );

  const linesOfCodeWidget = (
    <LinesOfCode
      name={name}
      onChange={handleChange}
      linesOfCode={fieldState[name]}
      isInvalid={isInvalid}
    />
  );

  const widgets = {
    text: textFieldWidget,
    textarea: textAreaWidget,
    select: selectFieldWidget,
    warden: wardenFieldWidget,
    linesOfCode: linesOfCodeWidget,
  };

  return widgets[widget];
};

export default Widget;
