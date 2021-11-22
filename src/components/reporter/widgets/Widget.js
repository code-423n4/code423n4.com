import React from "react";
import { SelectField, TextArea, TextField } from "./";
import WardenField from "./WardenField";

const Widget = (props) => {
  const { field, fieldState } = props;
  const { widget, name, label, helptext, required, options } = field;

  function handleChange(e) {
    props.onChange(e);
  }

  const textFieldWidget = (
    <TextField
      name={name}
      label={label}
      helptext={helptext}
      required={required}
      onChange={handleChange}
      fieldState={fieldState[name]}
    />
  );

  const textAreaWidget = (
    <TextArea
      name={name}
      label={label}
      helptext={helptext}
      required={required}
      onChange={handleChange}
      fieldState={fieldState[name]}
    />
  );

  const selectFieldWidget = (
    <SelectField
      name={name}
      label={label}
      helptext={helptext}
      required={required}
      onChange={handleChange}
      options={options}
      fieldState={fieldState[name]}
    />
  );

  const wardenFieldWidget = (
    <WardenField
      label={label}
      helptext={helptext}
      onChange={handleChange}
      options={options}
      fieldState={fieldState[name]}
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
