export const emailField = {
  name: "email",
  label: "Email address",
  helpText: "Used to send a copy of this form for your records",
  widget: "text",
  required: true,
};

export const addressField = {
  name: "address",
  label: "Polygon address",
  helpText:
    "Address where your prize should go. If you use a smart contract wallet, please contact one of our organizers in Discord in addition to adding the address here.",
  widget: "text",
  required: true,
};

export const titleField = {
  name: "title",
  label: "Title",
  helpText:
    "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
  widget: "text",
  required: true,
};

export const wardenField = (wardens) => {
  return {
    name: "handle",
    label: "Handle",
    helpText: "Handle you're competing under (individual or team name)",
    widget: "warden",
    required: true,
    options: wardens,
  };
};

export const linesOfCodeField = {
  name: "linesOfCode",
  label: "",
  helpText:"",
  widget: "linesOfCode",
  required: true,
};

export const riskField = {
  name: "risk",
  label: "Risk rating",
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
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
};

export const qaGasDetailsField = {
  name: "qaGasDetails",
  label: "Vulnerability details",
  helpText: "Link to all referenced sections of code in GitHub",
  widget: "textarea",
  required: true,
};
