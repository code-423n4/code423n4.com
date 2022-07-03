import React, { useEffect, useState } from "react";
import Agreement from "../content/Agreement";
import {
  emailField,
  addressField,
  titleField,
  riskField,
  wardenField,
  linesOfCodeField,
  vulnerabilityDetailsField,
  qaGasDetailsField,
} from "./findings/fields";
import {
  initStateFromStorage,
  config,
  checkTitle,
  checkQaOrGasFinding,
} from "./findings/functions";
import Form from "../form/Form";

const mdTemplate =
"## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  contest: "",
  sponsor: "",
  repo: "",
  title: "",
  email: "",
  handle: "",
  polygonAddress: "",
  risk: "",
  details: mdTemplate,
  qaGasDetails: "",
  linesOfCode: [
    {
      id: Date.now(),
      value: "",
    },
  ],
};

const OldSubmitFindings = ({ wardensList, sponsor, contest, repo }) => {
  const wardens = wardensList.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });

  const [state, setState] = useState(initialState);
  const [fieldList, setFieldList] = useState([
    wardenField(wardens),
    emailField,
    addressField,
    riskField,
  ]);
  const submissionUrl = `/.netlify/functions/old-submit-finding`;

  const displayedInfo = {
    title: `${sponsor} contest finding`,
    buttonText: "Create issue",
    successButton: "Submit another",
    afterSubmit: "Your report has been submitted.",
  };

  useEffect(() => {
    initStateFromStorage(contest, initialState, setState);
  }, [contest]);

  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem(contest, JSON.stringify(state));
    }
  }, [state, contest]);

  const changeHandler = (e) => {
    if (Array.isArray(e)) {
      setState((state) => {
        return { ...state, linesOfCode: e };
      });
    } else {
      const { name, value } = e?.target;
      switch (name) {
        case "risk":
          setState((state) => {
            return {
              ...state,
              [name]: value,
              labels: [config.labelAll, value ? value : ""],
            };
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

  const handleSubmit = (
    setHasValidationErrors,
    submitFinding,
    setIsExpanded
  ) => {
    const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
    const details = checkQaOrGasFinding(state.risk)
      ? state.qaGasDetails
      : state.details;
    const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;

    // extract required fields from field data for validation check
    const formatedRisk = state.risk ? state.risk.slice(0, 1) : "";
    const formatedBody = checkQaOrGasFinding(state.risk)
      ? details
      : markdownBody;

    const { email, handle, address, title } = state;
    const requiredFields = checkQaOrGasFinding(state.risk)
      ? [email, handle, address, formatedRisk, formatedBody]
      : [email, handle, address, formatedRisk, title, formatedBody];
    let hasErrors = requiredFields.some((field) => {
      return field === "" || field === undefined;
    });

    // TODO: verify that loc include code lines and are valid URLs
    if (!checkQaOrGasFinding(state.risk) && !state.linesOfCode[0].value) {
      hasErrors = true;
    }

    const regex = new RegExp("#L[0-9]+(-L[0-9]+)?$");
    const hasInvalidLinks = state.linesOfCode.some((line) => {
      return !regex.test(line.value);
    });

    const submitData = {
      contest,
      sponsor,
      repo: repo.split("/").pop(),
      email,
      handle,
      address,
      risk: formatedRisk,
      title: checkTitle(state.title, state.risk),
      body: formatedBody,
      labels: state.labels,
    };
    setHasValidationErrors(hasErrors || hasInvalidLinks);
    if (!hasErrors) {
      submitFinding(submissionUrl, submitData);
      if (typeof window !== `undefined`) {
        window.localStorage.removeItem(contest);
      }

      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (checkQaOrGasFinding(state.risk)) {
      setFieldList([
        wardenField(wardens),
        emailField,
        addressField,
        riskField,
        qaGasDetailsField,
      ]);
    } else {
      setFieldList([
        wardenField(wardens),
        emailField,
        addressField,
        riskField,
        titleField,
        linesOfCodeField,
        vulnerabilityDetailsField,
      ]);
    }
  }, [state.risk]); // don't add wardens from here

  const resetForm = () => {
    setState((prevState) => {
      return {
        ...prevState,
        title: "",
        risk: "",
        details: initialState.details,
        qaGasDetails: "",
        linesOfCode: [
          {
            id: Date.now(),
            value: "",
          },
        ],
      };
    });
  };

  return (
    <Form
      state={state}
      setState={setState}
      initialState={initialState}
      fieldsList={fieldList}
      handleSubmit={handleSubmit}
      changeHandler={changeHandler}
      displayedInfo={displayedInfo}
      resetForm={resetForm}
    >
      <Agreement />
    </Form>
  );
};

export default OldSubmitFindings;
