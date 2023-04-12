// @todo: remove * from required field labels after replacing widgets with Input compoenent

export const titleField = {
  name: "title",
  label: "Title *",
  helpText:
    "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
  widget: "text",
  required: true,
};

export const wardenField = (wardens) => {
  return {
    name: "handle",
    label: "Handle *",
    helpText: "Handle you're competing under (individual or team name)",
    widget: "warden",
    required: true,
    options: wardens,
  };
};

export const linksToCodeField = {
  name: "linksToCode",
  label: "",
  helpText: "",
  widget: "linksToCode",
  required: true,
};

export const mitigationRiskField = {
  name: "risk",
  label: "Risk rating *",
  widget: "select",
  required: true,
  options: [
    {
      label: "Medium Risk",
      value: "2 (Med Risk)",
    },
    {
      label: "High Risk",
      value: "3 (High Risk)",
    },
  ],
};

export const riskField = {
  name: "risk",
  label: "Risk rating *",
  widget: "select",
  required: true,
  options: [
    {
      label: "Gas Optimizations",
      value: "G (Gas Optimization)",
    },
    {
      label: "QA Report (low / non-critical)",
      value: "QA (Quality Assurance)",
    },
    {
      label: "Medium Risk",
      value: "2 (Med Risk)",
    },
    {
      label: "High Risk",
      value: "3 (High Risk)",
    },
  ],
};

export const vulnerabilityDetailsField = {
  name: "details",
  label: "Vulnerability details *",
  helpText:
    "Link to all referenced sections of code in GitHub. \n You can use " +
    "[markdown](https://www.markdownguide.org/basic-syntax/) including " +
    "[markdown math notation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions) " +
    "in this field",
  type: "markdown",
  widget: "textarea",
  required: true,
};

export const qaGasDetailsField = {
  name: "qaGasDetails",
  label: "Report contents *",
  helpText:
    "Link to all referenced sections of code in GitHub. \n You can use " +
    "[markdown](https://www.markdownguide.org/basic-syntax/) including " +
    "[markdown math notation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions) " +
    "in this field",
  type: "markdown",
  widget: "textarea",
  required: true,
};

export const mitigationField = {
  name: "isMitigated",
  label: "Mitigation confirmed (no new vulnerabilities detected)",
  widget: "checkbox",
  required: false,
};

export const mitigationOfField = {
  name: "mitigationOf",
  label: "Report ID of original finding *",
  helpText: `For new findings, please enter "NEW"`,
  placeholder: "H-01",
  widget: "text",
  required: true,
};
