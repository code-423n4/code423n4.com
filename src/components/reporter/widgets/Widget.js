import React from "react";
import { SelectField, TextArea, TextField } from "./";
import WardenField from "./WardenField";

const Widget = ({ field, fieldState, isInvalid, onChange }) => {
  const { widget, name, required, options } = field;

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
      onChange={handleChange}
      options={options}
      fieldState={fieldState[name]}
      isInvalid={isInvalid}
    />
  );

  const widgets = {
    text: textFieldWidget,
    textarea: textAreaWidget,
    select: selectFieldWidget,
    warden: wardenFieldWidget,
  };

  return widgets[widget];
};

export default Widget;
