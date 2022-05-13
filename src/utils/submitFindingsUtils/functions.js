import { riskField } from "./fields";
import { initialState } from "./state";

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

export const initStateFromStorage = (contest, sponsor, repoUrl, setState) => {
  if (typeof window !== `undefined`) {
    const dataObject = JSON.parse(window.localStorage.getItem(contest));
    let riskIndex = null;

    if (dataObject && dataObject.risk !== "") {
      riskIndex = riskField.options.findIndex(
        (element) => element.value === dataObject.risk
      );
    }
    setState({
      contest: contest,
      sponsor: sponsor,
      repo: repoUrl?.split("/").pop(),
      labels: dataObject?.labels || [config.labelAll, ""],
      title: dataObject?.title || "",
      email: dataObject?.email || "",
      handle: dataObject?.handle || "",
      address: dataObject?.address || "",
      risk: riskIndex !== null ? riskField.options[riskIndex].value : "",
      details: dataObject?.details || initialState.details,
      qaGasDetails: dataObject?.qaGasDetails || "",
      linesOfCode:
        dataObject?.linesOfCode && dataObject?.linesOfCode.length > 0
          ? dataObject?.linesOfCode
          : [
              {
                id: Date.now(),
                value: "",
              },
            ],
    });
  }
};

export const checkQaOrGasFinding = (risk) => {
  if (risk === ""){
    return true;
  } else {
    return risk.slice(0, 1) === "G" || risk.slice(0, 1) === "Q";
  }
};
