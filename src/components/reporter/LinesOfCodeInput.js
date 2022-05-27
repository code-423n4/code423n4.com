import React, { useCallback } from "react";
import clsx from "clsx";

import * as styles from "./widgets/Widgets.module.scss";

const InputField = ({
  value,
  index,
  id,
  handleChange,
  handleRemoveInputField,
  isInvalid,
}) => {
  return (
    <>
      {/* TODO: use an input component once widgets are refactored */}
      <div className="input-and-close-button">
        <input
          className={clsx(
            styles.Control,
            styles.Text,
            isInvalid && "input-error"
          )}
          name={index}
          type="text"
          onChange={(e) => handleChange(e, index)}
          value={value}
          autoComplete="off"
        />
        {index > 0 && (
          <button
            className="remove-line-button"
            type="button"
            onClick={() => handleRemoveInputField(id)}
            aria-label="Remove this field"
          >
            &#x2715;
          </button>
        )}
      </div>
      {isInvalid && (
        <label htmlFor={index} className={styles.ErrorMessage}>
          {value === "" ? (
            "This field is required"
          ) : (
            <span>
              Please include at least one line number at the end of your URL.{" "}
              <a
                href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet#linking-to-code"
                target="_blank"
                rel="noreferrer"
                aria-label="How do I link to line numbers on GitHub? Opens in new window"
              >
                How do I link to line numbers on GitHub?
              </a>
            </span>
          )}
        </label>
      )}
    </>
  );
};

// @todo: replace with DynamicInputGroup component
const LinesOfCode = ({ onChange, linesOfCode, isInvalid }) => {
  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedCodeLines = [...linesOfCode];
    updatedCodeLines[index].value = value;
    onChange(updatedCodeLines);
  };

  const handleRemoveInputField = useCallback(
    (id) => {
      const updatedCodeLines = linesOfCode.filter((field) => {
        return field.id !== id;
      });
      onChange(updatedCodeLines);
    },
    [linesOfCode, onChange]
  );

  const handleAddInputField = (e) => {
    const id = Date.now().toString();
    onChange([...linesOfCode, { id, value: "" }]);
  };

  return (
    <div className="lines-of-code">
      <label htmlFor="lines-of-code" className={styles.Label}>
        Links to affected code
      </label>
      <p>
        Provide GitHub links, including line numbers, to all instances of this
        bug throughout the repo. (
        <a
          href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet#linking-to-code"
          target="_blank"
          rel="noreferrer"
          aria-label="How do I link to line number on GitHub? Opens in new window."
        >
          How do I link to line numbers on GitHub?
        </a>
        )
      </p>
      {linesOfCode.map((field, i) => (
        <InputField
          key={field.id}
          value={field.value}
          index={i}
          id={field.id}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
          isInvalid={isInvalid}
        />
      ))}
      <button
        className="add-line-button"
        type="button"
        onClick={handleAddInputField}
      >
        Add another code block
      </button>
      <div className="featured-products"></div>
    </div>
  );
};

export default LinesOfCode;
