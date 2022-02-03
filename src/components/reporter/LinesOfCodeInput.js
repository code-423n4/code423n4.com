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
  onChange,
}) => (
  <div className="input-and-close-button">
    <input
      className={clsx(styles.Control, styles.Text, isInvalid && "input-error")}
      name={index}
      type="text"
      onChange={handleChange}
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

const LinesOfCode = (onChange) => {
  const [inputFields, setInputFields] = React.useState([
    { id: Date.now().toString(), value: "" },
  ]);
  function handleChange(e) {
    onChange(e);
  }
  const handleRemoveInputField = useCallback(
    (id) => {
      console.log("id removed=", id);
      console.log("inputFields", inputFields);
      const hello = inputFields.filter((field) => {
        console.log(field.id);
        return field.id != id;
      });
      console.log("hello variable", hello);
      setInputFields(hello);
    },
    [inputFields]
  );

  const handleAddInputField = (e) => {
    const id = Date.now().toString();
    console.log("id added=", id);
    setInputFields([...inputFields, { id, value: "" }]);
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
      {inputFields.map((field, i) => (
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
