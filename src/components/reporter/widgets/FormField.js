import React from 'react'
import * as styles from "./Widgets.module.scss";

function FormField({ name, label, helpText, isInvalid, children }) {
  return (
    <div className={styles.Container}>
      {label &&<label className={styles.Label} for={name}>{label}</label>}
      {helpText && <p className={styles.Help}>{helpText}</p>}
      {children}
      {isInvalid &&
        <label
          for={name}
          className={styles.ErrorMessage}
        >
          This field is required
        </label>
      }
    </div>
  )
}

export default FormField
