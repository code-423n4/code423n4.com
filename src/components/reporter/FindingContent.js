import React from "react";
import FormField from "./widgets/FormField";
import LinesOfCode from "./LinesOfCodeInput";
import Widget from "./widgets/Widget";
import ContestWarning from "../content/ContestWarning";
import {
  vulnerabilityDetailsField,
  qaGasDetailsField,
} from "../../utils/submitFindingsUtils/fields";

const FindingContent = ({
  hasValidationErrors,
  state,
  handleChange,
  isQaOrGasFinding,
}) => {
  return isQaOrGasFinding ? (
    <>
      <ContestWarning />
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
    </>
  ) : (
    <>
      <LinesOfCode
        onChange={handleChange}
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
