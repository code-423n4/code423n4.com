import React, { useCallback } from "react";
import clsx from "clsx";
import * as styles from "./widgets/Widgets.module.scss";

/* prop storage */
const isInvalid = false;

const InputField = ({
  value,
  index,
  id,
  handleChange,
  handleRemoveInputField,
}) => (
  <div className="input-and-close-button">
    <input
      className={clsx(styles.Control, styles.Text, isInvalid && "input-error")}
      name={index}
      type="text"
      onChange={(e) => handleChange(e, index)}
      value={value}
    />

    <button
      className="remove-line-button"
      type="button"
      onClick={() => handleRemoveInputField(id)}
      aria-label="Remove this field"
    >
      &#x2715;
    </button>
  </div>
);

const LinesOfCode = ({ onChange, codeLines }) => {
  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedCodeLines = [...codeLines];
    updatedCodeLines[index].value = value;
    onChange(updatedCodeLines);
  }

  const handleRemoveInputField = useCallback(
    (id) => {
      const updatedCodeLines = codeLines.filter((field) => {
        return field.id != id;
      });
      onChange(updatedCodeLines)
    },
    [codeLines]
  );

  const handleAddInputField = (e) => {
    const id = Date.now().toString();
    console.log("id added=", id);
    onChange([...codeLines, { id, value: "" }]);
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
      {codeLines.map((field, i) => (
        <InputField
          key={field.id}
          value={field.value}
          index={i}
          id={field.id}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
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
