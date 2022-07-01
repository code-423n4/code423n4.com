import React from "react";
import ReactMarkdown from "react-markdown";

import * as styles from "./Widgets.module.scss";

function FormField({
  name,
  label,
  helpText,
  type = null,
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
      {type !== 'markdown' && helpText ? (
            <p className={styles.Help}>{helpText}</p>
          ) : (
            <ReactMarkdown className={styles.Help}>{helpText}</ReactMarkdown>
          )}
      {children}
      {(isInvalid && name !== 'linesOfCode') && (
        <label htmlFor={name} className={styles.ErrorMessage}>
          {errorMessage}
        </label>
      )}
    </div>
  );
}

export default FormField;
