import React from "react";
import ReactMarkdown from "react-markdown";

import * as styles from "../../../styles/Main.module.scss";

function FormField({
  name,
  label,
  helpText,
  type = "",
  isInvalid,
  children,
  errorMessage = "This field is required",
}) {
  return (
    <div className={styles.Widget__Container}>
      {label && (
        <label className={styles.Widget__Label} htmlFor={name}>
          {label}
        </label>
      )}
      {type !== "markdown" && helpText ? (
        <p className={styles.Widget__Help}>{helpText}</p>
      ) : (
        <ReactMarkdown className={styles.Widget__Help}>{helpText}</ReactMarkdown>
      )}
      {children}
      {isInvalid && name !== "linksToCode" && (
        <label htmlFor={name} className={styles.Widget__ErrorMessage}>
          {errorMessage}
        </label>
      )}
    </div>
  );
}

export default FormField;
