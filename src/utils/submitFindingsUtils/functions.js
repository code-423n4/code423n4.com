import { riskField } from "./fields";
import { initialState } from "./state";
const submissionUrl = `/.netlify/functions/submit-finding`;

const config = {
  labelAll: "bug",
};

const checkTitle = (title, risk) => {
  if (risk === "G (Gas Optimization)") {
    return "Gas Optimizations";
  } else if (risk === "QA (Quality Assurance)") {
    return "QA Report";
  } else {
    return title;
  }
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

export const updateLocalStorage = (state, contest) => {
  if (typeof window !== `undefined`) {
    window.localStorage.setItem(contest, JSON.stringify(state));
  }
};

export const handleSubmit = (
  contest,
  state,
  isQaOrGasFinding,
  setHasValidationErrors,
  submitFinding,
  setIsExpanded
) => {
  const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
  const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
  const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;

  // extract required fields from field data for validation check
  const formatedRisk = state.risk ? state.risk.slice(0, 1) : "";
  const formatedBody = isQaOrGasFinding ? details : markdownBody;
  const { email, handle, address, title } = state;
  const requiredFields = isQaOrGasFinding
    ? [email, handle, address, formatedRisk, formatedBody]
    : [email, handle, address, formatedRisk, title, formatedBody];
  let hasErrors = requiredFields.some((field) => {
    return field === "" || field === undefined;
  });

  // TODO: verify that loc include code lines and are valid URLs
  if (!isQaOrGasFinding && !state.linesOfCode[0].value) {
    hasErrors = true;
  }

  const regex = new RegExp("#L", "g");
  const hasInvalidLinks = state.linesOfCode.some((line) => {
    return !regex.test(line.value);
  });

  setHasValidationErrors(hasErrors || hasInvalidLinks);
  if (!hasErrors) {
    // submitFinding(submissionUrl, { ...state, body: formatedBody }); //!! make sure state is correctly submited
    // if (typeof window !== `undefined`) {
    //   window.localStorage.removeItem(contest);
    // }
    console.log(submissionUrl, { ...state, body: formatedBody, title: checkTitle(state.title, state.risk) });
    setIsExpanded(false);
  }
};

export const initStateFromStorage = (
  contest,
  sponsor,
  repoUrl,
  setState,
  setIsQaOrGasFinding
) => {
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
      repo: repoUrl.split("/").pop(),
      labels: dataObject?.labelSet || [config.labelAll, ""] ,
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
    if (riskIndex !== null && riskField.options[riskIndex].value) {
      riskField.options[riskIndex].value.slice(0, 1) === "G" ||
      riskField.options[riskIndex].value.slice(0, 1) === "Q"
        ? setIsQaOrGasFinding(true)
        : setIsQaOrGasFinding(false);
    }
  }
};

export const changeHandler = (setState, e, setIsQaOrGasFinding) => {
  if (Array.isArray(e)) {
    setState((state) => {
      return { ...state, linesOfCode: e };
    });
  } else {
    const { name, value } = e?.target;
    switch (name) {
      case "risk":
        const riskLevel = value.slice(0, 1);
        if (riskLevel === "G" || riskLevel === "Q") {
          setIsQaOrGasFinding(true);
        } else {
          setIsQaOrGasFinding(false);
        }
        setState((state) => {
          return { ...state, [name]: value, labels: [config.labelAll, value ? value : ""]};
        });
        break;
      case "title":
        setState((state) => {
          return { ...state, [name]: checkTitle(value, state.risk) };
        });
        break;
      default:
        setState((state) => {
          return { ...state, [name]: value };
        });
        break;
    }
  }
};