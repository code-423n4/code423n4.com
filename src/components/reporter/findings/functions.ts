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

export const getCurrentStateFromStorage = (localStorageKey, initialState) => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const findingData = JSON.parse(window.localStorage.getItem(localStorageKey));
  if (!findingData) {
    return initialState;
  }

  return findingData;
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
