import React from "react";
import { Widget } from "./";
import * as styles from "./Widgets.module.scss";

const Widgets = (props) => {
  const { fields, fieldState } = props;

  function handleChange(e) {
    props.onChange(e);
  }
  return (
    <fieldset className={styles.Fields}>
      {fields.map((field, index) => (
        <Widget
          field={field}
          key={"widget-" + index}
          onChange={handleChange}
          fieldState={fieldState}
        />
      ))}
    </fieldset>
  );
};

export default Widgets;
