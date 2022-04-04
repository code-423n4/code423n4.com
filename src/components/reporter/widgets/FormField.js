import React from "react";

import * as styles from "./Widgets.module.scss";

function FormField({
  name,
  label,
  helpText,
  isInvalid,
  children,
  errorMessage = "This field is required",
}) {
  return (
    <div className={styles.Container}>
      {label && (
        <label className={styles.Label} htmlFor={name}>
          {label}
        </label>
      )}
      {helpText && <p className={styles.Help}>{helpText}</p>}
      {children}
      {isInvalid && (
        <label htmlFor={name} className={styles.ErrorMessage}>
          {errorMessage}
        </label>
      )}
    </div>
  );
}

export default FormField;
