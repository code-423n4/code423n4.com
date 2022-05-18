import React, { useEffect, useState } from "react";
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
import { initialState } from "./findings/state";
import {
  initStateFromStorage,
  config,
  checkTitle,
  checkQaOrGasFinding,
} from "./findings/functions";
import Form from "../form/Form";
import Agreement from "../content/Agreement";

const SubmitFindings = ({ wardensList, endTime, sponsor, contest, repo }) => {
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
  const submissionUrl = `/.netlify/functions/submit-finding`;

  const displayedInfo = {
    title: `${sponsor} contest finding`,
    buttonText: "Create issue",
    successButton: "Submit another",
    afterSubmit: "Your report has been submitted.",
  };

  useEffect(() => {
    initStateFromStorage(contest, sponsor, repo, setState);
  }, [contest, repo, sponsor, initStateFromStorage]);

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

    const regex = new RegExp("#L", "g");
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
  }, [state.risk]);

  return (
    <Form
      state={state}
      setState={setState}
      initialState={initialState}
      fieldsList={fieldList}
      handleSubmit={handleSubmit}
      changeHandler={changeHandler}
      displayedInfo={displayedInfo}
    >
      <Agreement />
    </Form>
  );
};

export default SubmitFindings;
