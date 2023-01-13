import React from "react";

import FormField from "./FormField";
import Widget from "./Widget";

import * as styles from "../../../styles/Main.module.scss";

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
    <fieldset className={styles.Widget__Fields}>
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
    </fieldset>
  );
};

export default Widgets;
