import React, { useEffect, useState, useCallback } from "react";

import {
  emailField,
  addressField,
  titleField,
  riskField,
  wardenField,
  linksToCodeField,
  vulnerabilityDetailsField,
  qaGasDetailsField,
} from "./findings/fields";
import {
  initStateFromStorage,
  config,
  checkTitle,
  checkQaOrGasFinding,
} from "./findings/functions";

import Agreement from "../content/Agreement";
import Form from "../form/Form";
import FormField from "./widgets/FormField";
import { Widget } from "./widgets";

import * as widgetStyles from "./widgets/Widgets.module.scss";

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  email: "",
  handle: "",
  polygonAddress: "",
  title: "",
  risk: "",
  details: mdTemplate,
  qaGasDetails: "",
  linksToCode: [""],
};

const OldSubmitFindings = ({ wardensList, sponsor, contest, repo }) => {
  const wardens = wardensList.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });

  const [state, setState] = useState(initialState);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [fieldList, setFieldList] = useState([
    wardenField(wardens),
    emailField,
    addressField,
    riskField,
  ]);

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
        return { ...state, linksToCode: e };
      });
    } else {
      const { name, value } = e?.target;
      switch (name) {
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

  const validator = useCallback(() => {
    const details = checkQaOrGasFinding(state.risk)
      ? state.qaGasDetails
      : state.details;
    const { email, handle, polygonAddress, title, risk } = state;
    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);
    // extract required fields from field data for validation check
    const requiredFields = checkQaOrGasFinding(state.risk)
      ? [email, handle, polygonAddress, risk, details]
      : [email, handle, polygonAddress, risk, title, details];
    const hasErrors = requiredFields.some((field) => {
      return field === "" || field === undefined;
    });

    if (hasErrors) {
      setHasValidationErrors(true);
      return true;
    }

    const linksToCodeRegex = new RegExp("#L[0-9]+(-L[0-9]+)?$");
    const hasInvalidLinks = state.linksToCode.some((link) => {
      return !linksToCodeRegex.test(link);
    });

    if (!isQaOrGasFinding && (!state.linksToCode[0] || hasInvalidLinks)) {
      setHasValidationErrors(true);
      return true;
    }

    setHasValidationErrors(false);
    return false;
  }, [state]);

  const handleSubmit = useCallback(async () => {
    const { email, handle, polygonAddress, linksToCode } = state;
    const linksToCodeString = linksToCode.join("\n");
    const details = checkQaOrGasFinding(state.risk)
      ? state.qaGasDetails
      : state.details;
    const markdownBody = `# Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${details}\n\n`;

    const formattedRisk = state.risk ? state.risk.slice(0, 1) : "";
    const formattedBody = checkQaOrGasFinding(state.risk)
      ? details
      : markdownBody;

    const submitData = {
      contest,
      sponsor,
      repo: repo.split("/").pop(),
      email,
      handle,
      address: polygonAddress,
      risk: formattedRisk,
      title: checkTitle(state.title, state.risk),
      body: formattedBody,
      labels: [config.labelAll, state.risk],
    };
    const submissionUrl = `/.netlify/functions/old-submit-finding`;
    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });
    if (!response.ok) {
      const { error } = await response.json();
      throw error || "Something went wrong.";
    }
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem(contest);
    }
  }, [state, contest, repo, sponsor]);

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
        linksToCodeField,
        vulnerabilityDetailsField,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.risk]); // don't add wardens from here

  const resetForm = () => {
    setState((prevState) => {
      return {
        ...prevState,
        title: "",
        risk: "",
        details: initialState.details,
        qaGasDetails: "",
        linksToCode: [""],
      };
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title={`${sponsor} contest finding`}
      submitButtonText="Create issue"
      successButtonText="Submit another"
      successMessage="Your report has been submitted."
      resetForm={resetForm}
      validator={validator}
    >
      <fieldset className={widgetStyles.Fields}>
        {fieldList.map((field, index) => {
          const isInvalid =
            hasValidationErrors && field.required && !state[field.name];
          return (
            <FormField
              key={`${field.name} ${index}`}
              name={field.name}
              label={field.label}
              helpText={field.helpText}
              type={field.type}
              isInvalid={isInvalid}
            >
              <Widget
                field={field}
                onChange={changeHandler}
                fieldState={state}
                isInvalid={isInvalid}
              />
            </FormField>
          );
        })}
      </fieldset>
      <Agreement />
    </Form>
  );
};

export default OldSubmitFindings;
