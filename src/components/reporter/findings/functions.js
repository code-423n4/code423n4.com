import { riskField } from "./fields";

export const config = {
  labelAll: "bug",
};

export const getTitle = (title, risk) => {
  if (risk === "G (Gas Optimization)") {
    return "Gas Optimizations";
  } else if (risk === "QA (Quality Assurance)") {
    return "QA Report";
  } else {
    return title;
  }
};

// @todo: remove this function once old submit findings form is removed
export const initStateFromStorage = (contest, initialState, setState) => {
  if (typeof window === "undefined") {
    return;
  }

  const findingData = JSON.parse(window.localStorage.getItem(contest));
  if (!findingData) {
    return;
  }

  const riskIndex = riskField.options.findIndex(
    (element) => element.value === findingData.risk
  );
  setState((prevState) => {
    return {
      ...prevState,
      title: findingData.title || initialState.title,
      risk:
        riskIndex >= 0 ? riskField.options[riskIndex].value : initialState.risk,
      details: findingData.details || initialState.details,
      qaGasDetails: findingData.qaGasDetails || initialState.qaGasDetails,
      linksToCode:
        findingData.linksToCode && findingData.linksToCode.length > 0
          ? findingData.linksToCode
          : initialState.linksToCode,
    };
  });
};

export const getCurrentStateFromStorage = (localStorageKey, initialState) => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const findingData = JSON.parse(window.localStorage.getItem(localStorageKey));
  if (!findingData) {
    return initialState;
  }

  const riskIndex = riskField.options.findIndex(
    (element) => element.value === findingData.risk
  );
  return {
    title: findingData.title || initialState.title,
    risk:
      riskIndex >= 0 ? riskField.options[riskIndex].value : initialState.risk,
    details: findingData.details || initialState.details,
    qaGasDetails: findingData.qaGasDetails || initialState.qaGasDetails,
    linksToCode:
      findingData.linksToCode && findingData.linksToCode.length > 0
        ? findingData.linksToCode
        : initialState.linksToCode,
  };
};

export const setStateInLocalStorage = (localStorageKey, state) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(state));
};

export const checkQaOrGasFinding = (risk) => {
  return risk.slice(0, 1) === "G" || risk.slice(0, 1) === "Q";
};
