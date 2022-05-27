import clsx from "clsx";
import React, { ComponentType, ReactNode, useCallback } from "react";

import * as styles from "./DynamicInputGroup.module.scss";
import { InputProps } from "./Input";

interface InputField {
  id: string;
  value: string;
}

interface DynamicInputGroupProps {
  onChange: (payload: InputField[]) => void;
  Input: ComponentType<InputProps>;
  fields: InputField[];
  children: ReactNode;
  validator: (value: string | number) => (string | ReactNode)[];
  type: string;
  className?: string;
}

const initialField: InputField = {
  id: Date.now().toString(),
  value: "",
};

export const DynamicInputGroup = ({
  onChange,
  fields,
  Input,
  children,
  validator,
  type,
  className,
}: DynamicInputGroupProps) => {
  const handleChange = (e) => {
    const { value } = e.target;
    const index = parseInt(e.target.name);
    if (!fields.length) {
      onChange([{ ...initialField, value }]);
      return;
    }
    const updatedCodeLines = [...fields];
    updatedCodeLines[index].value = value;
    onChange(updatedCodeLines);
  };

  const handleRemoveInputField = useCallback(
    // @todo: see if this works just using the index
    // the name is the index
    (name: string): void => {
      const index = parseInt(name);
      const updatedCodeLines = fields.slice(index, 1);
      onChange(updatedCodeLines);
    },
    [fields, onChange]
  );

  const handleAddInputField = (): void => {
    const id = Date.now().toString();
    const newField: InputField = initialField;
    onChange([...fields, newField]);
  };

  return (
    <div className={clsx(styles.DynamicInputGroup, className)}>
      {children}
      {!fields.length ? (
        <Input
          value={""}
          name="defaultInput"
          canRemove={false}
          required={true}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
          validator={validator}
        />
      ) : (
        fields.map((field, i) => (
          <Input
            key={field.id}
            value={field.value}
            // name is set to index for the purpose of
            // removing/updating the right field in the array
            name={`${i}`}
            canRemove={i > 0}
            required={i === 0}
            handleChange={handleChange}
            handleRemoveInputField={handleRemoveInputField}
            validator={validator}
          />
        ))
      )}
      <button
        className={styles.AddLineButton}
        type="button"
        onClick={handleAddInputField}
      >
        {`Add another ${type}`}
      </button>
    </div>
  );
};
