import React from "react";
import { Widget } from "./";
import FormField from "./FormField";
import * as styles from "./Widgets.module.scss";

const Widgets = (props) => {
  const { fields, fieldState, showValidationErrors } = props;

  function handleChange(e) {
    props.onChange(e);
  }
  return (
    <fieldset className={styles.Fields}>
      {fields.map((field, index) => {
        const { name, label, helpText, required } = field;
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
        )
      })}
    </fieldset>
  );
};

export default Widgets;
