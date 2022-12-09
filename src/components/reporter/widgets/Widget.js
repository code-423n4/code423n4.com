import React from "react";

import { SelectField, TextArea, TextField } from "./";
import LinksToCode from "../LinksToCodeInput";
import WardenField from "./WardenField";
import ContestWarning from "../findings/ContestWarning";

import * as widgetStyles from "./Widgets.module.scss";

const Widget = ({ field, fieldState, isInvalid, onChange }) => {
  const { widget, name, required, options, maxSize, label } = field;

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

  const checkboxWidget = (
    <label htmlFor={name} className={widgetStyles.Container}>
      <input
        className={widgetStyles.Checkbox}
        type="checkbox"
        id={name}
        name={name}
        checked={fieldState[name] === true}
        onChange={handleChange}
      />
      {label}
    </label>
  );

  const widgets = {
    text: textFieldWidget,
    textarea: textAreaWidget,
    select: selectFieldWidget,
    warden: wardenFieldWidget,
    linksToCode: linksToCodeInputGroup,
    checkbox: checkboxWidget,
  };

  return widgets[widget];
};

export default Widget;
