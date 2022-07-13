import { riskField } from "./fields";

export const config = {
  labelAll: "bug",
};

export const checkTitle = (title, risk) => {
  if (risk === "G (Gas Optimization)") {
    return "Gas Optimizations";
  } else if (risk === "QA (Quality Assurance)") {
    return "QA Report";
  } else {
    return title;
  }
};

export const initStateFromStorage = (contest, initialState, setState) => {
  if (typeof window === "undefined") {
    return;
  }

  const dataObject = JSON.parse(window.localStorage.getItem(contest));
  if (!dataObject) {
    return;
  }

  const riskIndex = riskField.options.findIndex(
    (element) => element.value === dataObject.risk
  );
  setState((prevState) => {
    return {
      ...prevState,
      title: dataObject.title || "",
      risk: riskIndex >= 0 ? riskField.options[riskIndex].value : "",
      details: dataObject.details || initialState.details,
      qaGasDetails: dataObject.qaGasDetails || "",
      linksToCode:
        dataObject.linksToCode && dataObject.linksToCode.length > 0
          ? dataObject.linksToCode
          : initialState.linksToCode,
    };
  });
};

export const checkQaOrGasFinding = (risk) => {
  return risk.slice(0, 1) === "G" || risk.slice(0, 1) === "Q";
};
