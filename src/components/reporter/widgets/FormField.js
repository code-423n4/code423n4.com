import React from "react";
import ReactMarkdown from "react-markdown";

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
    <fieldset className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      {type !== "markdown" && helpText ? (
        <p>{helpText}</p>
      ) : (
        <ReactMarkdown className={"form-field__help-text"}>
          {helpText}
        </ReactMarkdown>
      )}
      {children}
      {isInvalid && name !== "linksToCode" && (
        <div id={name + "--error"} className={"form-field__error"}>
          {errorMessage}
        </div>
      )}
    </fieldset>
  );
}

export default FormField;
