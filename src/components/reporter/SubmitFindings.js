import clsx from "clsx";
import React, { useEffect, useState, useCallback } from "react";
import Moralis from "moralis";

// helpers
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

// components
import Agreement from "../content/Agreement";
import FormField from "./widgets/FormField";
import WardenDetails from "../WardenDetails";
import Widget from "./widgets/Widget";

// styles
import * as styles from "../form/Form.module.scss";
import * as widgetStyles from "../reporter/widgets/Widgets.module.scss";

const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  title: "",
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

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const SubmitFindings = ({ wardensList, sponsor, contest, repo }) => {
  const wardens = wardensList.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });
  const { currentUser } = useUser();
  // Component State
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, setState] = useState(initialState);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [polygonAddress, setPolygonAddress] = useState("");
  const [newTeamAddress, setNewTeamAddress] = useState("");
  const [attributedTo, setAttributedTo] = useState("");
  const [fieldList, setFieldList] = useState([
    wardenField(wardens),
    emailField,
    addressField,
    riskField,
  ]);
  const submissionUrl = `/.netlify/functions/submit-finding`;

  // effects
  useEffect(() => {
    (() => {
      if (currentUser.isLoggedIn) {
        setEmailAddresses([currentUser.emailAddress]);
        setPolygonAddress(currentUser.address);
        setAttributedTo(currentUser.username);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    initStateFromStorage(contest, initialState, setState);
  }, [contest]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const { risk, details, qaGasDetails, linesOfCode, title } = state;
    window.localStorage.setItem(
      contest,
      JSON.stringify({ risk, details, qaGasDetails, linesOfCode, title })
    );
  }, [state, contest]);

  useEffect(() => {
    // set which fields are shown based on risk
    let fieldList = [riskField];
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
  }, [state.risk, currentUser]);

  // change handlers
  const handleChange = (e) => {
    if (Array.isArray(e)) {
      setState((state) => {
        return { ...state, linesOfCode: e };
      });
    } else {
      const { name, value } = e.target;
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

  const handleAttributionChange = (e) => {
    if (e.target.name === "team") {
      const team = currentUser.teams[e.target.value];
      if (!team) {
        return;
      }
      setAttributedTo(team.username || "");
      setPolygonAddress(team.address || newTeamAddress);
    } else {
      setAttributedTo(currentUser.username);
      setPolygonAddress(currentUser.address);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewTeamAddress(e.target.value);
    setPolygonAddress(e.target.value);
  };

  const handleReset = () => {
    setState((prevState) => {
      return {
        ...prevState,
        title: "",
        risk: "",
        details: initialState.details,
        qaGasDetails: "",
        linesOfCode: initialState.linesOfCode,
      };
    });
    setStatus(FormStatus.Unsubmitted);
  };

  const submitFinding = useCallback(
    (url, data) => {
      (async () => {
        setStatus(FormStatus.Submitting);
        const user = await Moralis.User.current();
        if (!user) {
          setStatus(FormStatus.Error);
          return;
        }
        const sessionToken = user.attributes.sessionToken;
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            setStatus(FormStatus.Submitted);
            if (typeof window !== `undefined`) {
              window.localStorage.removeItem(contest);
            }
          } else {
            setStatus(FormStatus.Error);
            const message = await response.json();
            if (message) {
              setErrorMessage(message);
            }
          }
        } catch (error) {
          setStatus(FormStatus.Error);
          console.error(error);
        }
      })();
    },
    [contest]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser.isLoggedIn) {
      return;
    }

    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);
    const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
    const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
    const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;

    // extract required fields from field data for validation check
    const formatedRisk = state.risk ? state.risk.slice(0, 1) : "";
    const formatedBody = isQaOrGasFinding ? details : markdownBody;

    const requiredFields = isQaOrGasFinding
      ? [formatedRisk, formatedBody]
      : [formatedRisk, state.title, formatedBody];
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
      user: currentUser.username,
      contest,
      sponsor,
      repo: repo.split("/").pop(),
      emailAddresses,
      attributedTo,
      address: polygonAddress,
      risk: formatedRisk,
      title: checkTitle(state.title, state.risk),
      body: formatedBody,
      labels: [config.labelAll, state.risk],
    };

    submitFinding(submissionUrl, submitData);
    setIsExpanded(false);
  };

  return currentUser.isLoggedIn ? (
    <div
      className={
        !isExpanded ? clsx(styles.Form) : clsx(styles.Form, styles.FormMax)
      }
    >
      <div className={clsx(styles.FormHeader)}>
        <h1>{`${sponsor} contest finding`}</h1>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(styles.FormIconButton)}
        >
          <img
            src={isExpanded ? "/images/compress.svg" : "/images/expand.svg"}
            alt={isExpanded ? "compress form" : "expand form"}
            className={clsx(styles.FormIcons)}
          />
        </button>
      </div>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <fieldset className={widgetStyles.Fields}>
            <h2>User Info</h2>
            {currentUser.teams.length > 0 ? (
              <fieldset
                className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}
              >
                <h3>Submitting as</h3>
                <label>WARDEN</label>
                <label className={widgetStyles.RadioLabel}>
                  <input
                    className={widgetStyles.Radio}
                    type="radio"
                    value={currentUser.username}
                    name="currentUser"
                    checked={attributedTo === currentUser.username}
                    onChange={handleAttributionChange}
                  />
                  <WardenDetails
                    username={currentUser.username}
                    address={currentUser.address}
                    img={currentUser.img}
                  />
                </label>
                <label>TEAM MEMBER</label>
                {currentUser.teams.map((team, i) => (
                  <label
                    className={widgetStyles.RadioLabel}
                    key={team.username}
                  >
                    <input
                      className={widgetStyles.Radio}
                      type="radio"
                      value={i}
                      name="team"
                      checked={attributedTo === team.username}
                      onChange={handleAttributionChange}
                    />
                    <WardenDetails
                      username={team.username}
                      address={team.address}
                      img={team.img}
                    />
                    {!team.address && attributedTo === team.username && (
                      <div>
                        <label htmlFor={"newTeamAddress"}>
                          Team Polygon Address
                        </label>
                        <input
                          className={clsx(
                            widgetStyles.Control,
                            widgetStyles.Text
                          )}
                          type="text"
                          id={"newTeamAddress"}
                          placeholder="0x00000..."
                          value={newTeamAddress}
                          onChange={handleNewAddressChange}
                          maxLength={64}
                        />
                      </div>
                    )}
                  </label>
                ))}
              </fieldset>
            ) : (
              <WardenDetails
                username={currentUser.username}
                address={currentUser.address}
                img={currentUser.img}
              />
            )}
          </fieldset>
          <fieldset className={widgetStyles.Fields}>
            {fieldList.map((field, index) => {
              let isInvalid = false;
              if (field.name === "linesOfCode") {
                isInvalid = hasValidationErrors;
              } else {
                isInvalid = hasValidationErrors && !state[field.name];
              }
              return (
                <FormField
                  key={`${field.name} ${index}`}
                  name={field.name}
                  label={field.label}
                  helpText={field.helpText}
                  isInvalid={isInvalid}
                >
                  <Widget
                    field={field}
                    onChange={handleChange}
                    fieldState={state}
                    isInvalid={isInvalid}
                  />
                </FormField>
              );
            })}
          </fieldset>
          <Agreement />
          <button
            className="button cta-button centered"
            type="button"
            onClick={handleSubmit}
            disabled={status !== FormStatus.Unsubmitted}
          >
            {status === FormStatus.Unsubmitted
              ? "Create issue"
              : "Submitting..."}
          </button>
        </form>
      )}
      {status === FormStatus.Error && (
        <div>
          <p>{errorMessage}</p>
          <button
            className="button cta-button"
            type="button"
            onClick={() => setStatus(FormStatus.Unsubmitted)}
          >
            Try again
          </button>
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div className="centered-text">
          <h1>Thank you!</h1>
          <p>Your report has been submitted.</p>
          <button
            className="button cta-button"
            type="button"
            onClick={handleReset}
          >
            Submit another
          </button>
        </div>
      )}
    </div>
  ) : (
    <p>You must connect your wallet to submit findings</p>
  );
};

export default SubmitFindings;
