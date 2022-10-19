import React from "react";

import { SelectField, TextArea, TextField } from "./";
import LinksToCode from "../LinksToCodeInput";
import WardenField from "./WardenField";
import ContestWarning from "../findings/ContestWarning";

const Widget = ({ field, fieldState, isInvalid, onChange }) => {
  const { widget, name, required, options, maxSize } = field;

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
    />
  );

  const selectFieldWidget = (
    <>
      <SelectField
        name={name}
        required={required}
        onChange={handleChange}
        options={options}
        fieldState={fieldState[name]}
        isInvalid={isInvalid}
      />
      {(fieldState[name] === "G (Gas Optimization)" ||
        fieldState === "QA (Quality Assurance)") &&
        name === "risk" && <ContestWarning />}
    </>
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

  const linksToCodeInputGroup = (
    <LinksToCode onChange={handleChange} linksToCode={fieldState[name]} />
  );

  const widgets = {
    text: textFieldWidget,
    textarea: textAreaWidget,
    select: selectFieldWidget,
    warden: wardenFieldWidget,
    linksToCode: linksToCodeInputGroup,
  };

  return widgets[widget];
};

export default Widget;
