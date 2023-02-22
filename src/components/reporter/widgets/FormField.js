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
    <div className="form-field">
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
        </label>
      )}
      {type !== "markdown" && helpText ? (
        <p className={"Widget__Help"}>{helpText}</p>
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
    </div>
  );
}

export default FormField;
