import React, { useCallback } from "react";
import clsx from "clsx";
import * as styles from "./widgets/Widgets.module.scss";

const InputField = ({
  value,
  index,
  id,
  handleChange,
  handleRemoveInputField,
  hasValidationErrors,
}) => {
  const isInvalid = hasValidationErrors && index === 0 && value === "";

  return (
    <div>
      {/* TODO: use and input component once widgets are refactored */}
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
        <label for={index} className={styles.ErrorMessage}>
          This field is required
        </label>
      )}
    </div>
  );
};

const LinesOfCode = ({ onChange, linesOfCode, hasValidationErrors }) => {
  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedCodeLines = [...linesOfCode];
    updatedCodeLines[index].value = value;
    onChange(updatedCodeLines);
  };

  const handleRemoveInputField = useCallback(
    (id) => {
      const updatedCodeLines = linesOfCode.filter((field) => {
        return field.id != id;
      });
      onChange(updatedCodeLines);
    },
    [linesOfCode]
  );

  const handleAddInputField = (e) => {
    const id = Date.now().toString();
    onChange([...linesOfCode, { id, value: "" }]);
  };

  return (
    <div class="lines-of-code-input">
      <h2>Links to affected code</h2>
      <p>
        Provide GitHub links, including line numbers, to all instances of this
        bug throughout the repo. (
        <a
          href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet#linking-to-code"
          target="_blank"
          aria-label="How do I link to line number on GitHub? Opens in new window."
        >
          How do I link to line numbers on GitHub?
        </a>
        )
      </p>
      {/* inputfield.map , return an input field component where the name is the index */}
      {linesOfCode.map((field, i) => (
        <InputField
          key={field.id}
          value={field.value}
          index={i}
          id={field.id}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
          hasValidationErrors={hasValidationErrors}
        />
      ))}
      <button
        className="add-line-button"
        type="button"
        onClick={handleAddInputField}
      >
        Add another code block
      </button>
      <div class="featured-products"></div>
    </div>
  );
};

export default LinesOfCode;
