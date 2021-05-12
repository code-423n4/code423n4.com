import React from "react";
import clsx from "clsx";
import * as styles from "./Widgets.module.scss";

const SelectField = (props) => {
  const { name, label, options, helptext } = props;
  function handleChange(e) {
    props.onChange(e);
  }
  return (
    <div className={styles.Container}>
      <label className={styles.Label}>
        {label}
        <p className={styles.Help}>{helptext}</p>
        <select
          className={clsx(styles.Control, styles.Select)}
          name={name}
          onChange={handleChange}
        >
          <option value="">— Select —</option>
          {options.map((option, index) => (
            <option key={"option-" + index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectField;
