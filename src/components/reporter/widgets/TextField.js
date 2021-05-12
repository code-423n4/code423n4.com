import React from "react";
import clsx from "clsx";
import * as styles from "./Widgets.module.scss";

const TextField = (props) => {
  const { name, label, helptext, required, fieldState } = props;
  function handleChange(e) {
    props.onChange(e);
  }
  return (
    <div className={styles.Container}>
      <label className={styles.Label}>{label}</label>
      <p className={styles.Help}>{helptext}</p>
      <input
        className={clsx(styles.Control, styles.Text)}
        name={name}
        type="text"
        onChange={handleChange}
        required={required}
        value={fieldState}
      />
    </div>
  );
};

export default TextField;
