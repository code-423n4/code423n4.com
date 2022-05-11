import React from 'react';
import FormField from './widgets/FormField';
import LinesOfCode from './LinesOfCodeInput';
import Widget from './widgets/Widget';

const FindingContent = ({
  hasValidationErrors,
  state,
  handleChange,
  handleLocChange,
  isQaOrGasFinding,
  titleField,
  qaGasDetailsField,
  vulnerabilityDetailsField
}) => {
  return isQaOrGasFinding ? (
    <FormField
      name={qaGasDetailsField.name}
      label={qaGasDetailsField.label}
      helpText={qaGasDetailsField.helpText}
      isInvalid={hasValidationErrors && !state.qaGasDetails}
    >
      <Widget
        field={qaGasDetailsField}
        onChange={handleChange}
        fieldState={state}
        isInvalid={hasValidationErrors && !state.qaGasDetails}
      />
    </FormField>
  ) : (
    <>
      <FormField
        name={titleField.name}
        label={titleField.label}
        helpText={titleField.helpText}
        isInvalid={hasValidationErrors && !state.title}
      >
        <Widget
          field={titleField}
          onChange={handleChange}
          fieldState={state}
          isInvalid={hasValidationErrors && !state.title}
        />
      </FormField>
      <LinesOfCode
        onChange={handleLocChange}
        linesOfCode={state.linesOfCode}
        hasValidationErrors={hasValidationErrors}
      />
      <FormField
        name={vulnerabilityDetailsField.name}
        label={vulnerabilityDetailsField.label}
        helpText={vulnerabilityDetailsField.helpText}
        isInvalid={hasValidationErrors && !state.details}
      >
        <Widget
          field={vulnerabilityDetailsField}
          onChange={handleChange}
          fieldState={state}
          isInvalid={hasValidationErrors && !state.details}
        />
      </FormField>
    </>
  );
};

export default FindingContent;