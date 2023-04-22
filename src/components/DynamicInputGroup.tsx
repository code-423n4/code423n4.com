import clsx from "clsx";
import React, { ReactNode, useCallback } from "react";

import { Input } from "./Input";

interface DynamicInputGroupProps {
  onChange: (payload: string[]) => void;
  fields: string[];
  children?: ReactNode;
  validator?: (value: string) => (string | ReactNode)[];
  fieldName: string;
  className?: string | undefined;
  required?: boolean | undefined;
  // optional button to show on the right of the inputs
  button?: string;
  handleButtonClick?: (value: string) => void;
}

export const DynamicInputGroup = ({
  onChange,
  fields,
  children,
  validator,
  fieldName,
  className,
  required,
  button,
  handleButtonClick,
}: DynamicInputGroupProps) => {
  const handleChange = (e) => {
    const { value } = e.target;
    // the name is the index
    const index = parseInt(e.target.name);
    if (!fields.length) {
      onChange([value]);
      return;
    }
    const updatedCodeLines = [...fields];
    updatedCodeLines[index] = value;
    onChange(updatedCodeLines);
  };

  const handleRemoveInputField = useCallback(
    // the name is the index
    (name: string): void => {
      const index = parseInt(name);
      const updatedCodeLines = fields.slice();
      updatedCodeLines.splice(index, 1);
      onChange(updatedCodeLines);
    },
    [fields, onChange]
  );

  const handleAddInputField = (): void => {
    onChange([...fields, ""]);
  };

  return (
    <div className={clsx("dynamic-input-group", className)}>
      {children}
      {fields.map((value, i) => (
        <Input
          key={`field-${fieldName}-${i}`}
          value={value}
          // name is set to index for the purpose of
          // removing/updating the right field in the array
          name={`${i}`}
          canRemove={required ? i > 0 : true}
          required={required && i === 0}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
          validator={validator}
          button={button}
          handleButtonClick={handleButtonClick}
        />
      ))}
      <button
        className="button button--text-link"
        type="button"
        onClick={handleAddInputField}
      >
        {`Add another ${fieldName}`}
      </button>
    </div>
  );
};
