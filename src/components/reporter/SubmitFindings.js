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
import {
  initStateFromStorage,
  config,
  checkTitle,
  checkQaOrGasFinding,
} from "./findings/functions";

import useUser from "../../hooks/UserContext";

import Form from "../form/Form";
import Agreement from "../content/Agreement";

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
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

const SubmitFindings = ({ wardensList, sponsor, contest, repo }) => {
  const wardens = wardensList.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });
  const { currentUser } = useUser();
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
    (() => {
      if (currentUser.isLoggedIn) {
        setState((prevState) => {
          return {
            ...prevState,
            handle: currentUser.username,
            polygonAddress: currentUser.address,
            email: currentUser.emailAddress,
          };
        });
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            handle: "",
            polygonAddress: "",
            email: "",
          };
        });
      }
    })();
  }, [
    currentUser.isLoggedIn,
    currentUser.address,
    currentUser.username,
    currentUser.emailAddress,
  ]);

  useEffect(() => {
    initStateFromStorage(contest, initialState, setState);
  }, [contest, initialState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const { risk, details, qaGasDetails, linesOfCode, title } = state;
    window.localStorage.setItem(
      contest,
      JSON.stringify({ risk, details, qaGasDetails, linesOfCode, title })
    );
  }, [
    state.risk,
    state.details,
    state.qaGasDetails,
    state.linesOfCode,
    state.title,
    contest,
  ]);

  const changeHandler = (e) => {
    if (Array.isArray(e)) {
      setState((state) => {
        return { ...state, linesOfCode: e };
      });
    } else {
      const { name, value } = e?.target;
      switch (name) {
        case "title":
          setState((prevState) => {
            return { ...prevState, [name]: checkTitle(value, prevState.risk) };
          });
          break;
        default:
          setState((prevState) => {
            return { ...prevState, [name]: value };
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
    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);
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

    if (!isQaOrGasFinding && (!state.linesOfCode[0].value || hasInvalidLinks)) {
      hasErrors = true;
    }
    if (hasErrors) {
      setHasValidationErrors(hasErrors);
      return;
    }

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
      labels: [config.labelAll, state.risk],
    };
    submitFinding(submissionUrl, submitData);
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem(contest);
    }

    setIsExpanded(false);
  };

  useEffect(() => {
    let fieldList = [];
    if (!currentUser.isLoggedIn) {
      fieldList = [wardenField(wardens), emailField, addressField];
    }
    fieldList.push(riskField);
    if (!state.risk) {
      setFieldList(fieldList);
      return;
    }
    if (checkQaOrGasFinding(state.risk)) {
      fieldList.push(qaGasDetailsField);
      setFieldList(fieldList);
      return;
    }
    setFieldList(
      fieldList.concat([
        titleField,
        linesOfCodeField,
        vulnerabilityDetailsField,
      ])
    );
  }, [state.risk, currentUser.isLoggedIn]);

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

export default SubmitFindings;
