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
      onChange={handleChange}
      value={value}
    />

    <button
      className="remove-line-button"
      type="button"
      onClick={() => handleRemoveInputField(id)}
    >
      X
    </button>
  </div>
);

const LinesOfCode = () => {
  const [inputFields, setInputFields] = React.useState([
    { id: Date.now().toString(), value: "" },
  ]);

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

  const handleChange = useCallback(() => {
    console.log("hello");
  }, []);

  const handleAddInputField = (e) => {
    const id = Date.now().toString();
    console.log("id added=", id);
    setInputFields([...inputFields, { id, value: "" }]);
  };

  return (
    <>
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
    </>
  );
};

export default LinesOfCode;
