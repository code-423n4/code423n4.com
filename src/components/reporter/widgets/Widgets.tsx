import React from "react";

import FormField from "./FormField";
import Widget from "./Widget";

export interface Field {
  name: string;
  label: string;
  widget: string;
  type?: string;
  helpText?: string;
  required?: boolean;
  options?: Record<string, unknown>[];
  placeholder?: string;
}

interface WidgetsProps {
  fields: Field[];
  fieldState: Record<string, unknown>;
  showValidationErrors: boolean;
}

const Widgets = (props) => {
  const { fields, fieldState, showValidationErrors }: WidgetsProps = props;

  function handleChange(e) {
    props.onChange(e);
  }
  return (
    <div className="widget__fields">
      {fields.map((field, index) => {
        const { name, label, helpText, required, placeholder } = field;
        const isInvalid = required && showValidationErrors && !fieldState[name];

        return (
          <FormField
            key={"widget-" + index}
            name={name}
            label={label}
            helpText={helpText}
            isInvalid={isInvalid}
            required={required}
          >
            <Widget
              field={field}
              onChange={handleChange}
              fieldState={fieldState}
              isInvalid={isInvalid}
            />
          </FormField>
        );
      })}
    </div>
  );
};

export default Widgets;
