import clsx from "clsx";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// helpers
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
  config,
  getTitle,
  checkQaOrGasFinding,
  getCurrentStateFromStorage,
  setStateInLocalStorage,
} from "./findings/functions";
import useUser from "../../hooks/UserContext";
import { useModalContext } from "../../hooks/ModalContext";

// types
import { Field } from "./widgets/Widgets";
import { FindingRequestData, ReportState } from "../../templates/ReportForm";

// components
import Agreement from "../content/Agreement";
import { DynamicInputGroup } from "../DynamicInputGroup";
import FormField from "./widgets/FormField";
import WardenDetails from "../WardenDetails";
import Widget from "./widgets/Widget";

// styles
import * as styles from "../form/Form.module.scss";
import * as widgetStyles from "../reporter/widgets/Widgets.module.scss";

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

interface SubmitFindingsProps {
  wardensList: { edges: { node: { handle: string; image: unknown } }[] };
  sponsor: string;
  contest: string;
  repo: string;
  title: string;
  initialState: ReportState;
  onSubmit: (data: FindingRequestData) => Promise<Response>;
  findingId: string;
}

const SubmitFindings = ({
  wardensList,
  sponsor,
  contest,
  repo,
  title,
  initialState,
  onSubmit,
  findingId,
}: SubmitFindingsProps) => {
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
  const [additionalEmailAddresses, setAdditionalEmailAddresses] = useState([]);
  const [polygonAddress, setPolygonAddress] = useState("");
  const [newTeamAddress, setNewTeamAddress] = useState("");
  const [attributedTo, setAttributedTo] = useState("");
  const [fieldList, setFieldList] = useState<Field[]>([
    wardenField(wardens),
    emailField,
    addressField,
    riskField,
  ]);
  const { showModal } = useModalContext();

  // effects
  useEffect(() => {
    (() => {
      if (currentUser.isLoggedIn) {
        setPolygonAddress(currentUser.address);
        setAttributedTo(currentUser.username);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    const currentState = getCurrentStateFromStorage(findingId, initialState);
    setState(currentState);
  }, [findingId, initialState]);

  useEffect(() => {
    setStateInLocalStorage(findingId, state);
  }, [state, findingId]);

  useEffect(() => {
    // set which fields are shown based on risk
    let fieldList: Field[] = [riskField];
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
        linksToCodeField,
        vulnerabilityDetailsField,
      ])
    );
  }, [state.risk, currentUser]);

  // change handlers
  const handleChange = (e) => {
    if (Array.isArray(e)) {
      setState((prevState) => {
        return { ...prevState, linksToCode: e };
      });
    } else {
      const { name, value } = e.target;
      switch (name) {
        case "title":
          setState((prevState) => {
            return { ...prevState, [name]: getTitle(value, prevState.risk) };
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
        linksToCode: initialState.linksToCode,
      };
    });
    setStatus(FormStatus.Unsubmitted);
  };

  const submitFinding = useCallback(async () => {
    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);

    const linksToCodeString = state.linksToCode.join("\n");
    const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
    const markdownBody = `# Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${details}\n\n`;
    const formattedRisk = state.risk ? state.risk.slice(0, 1) : "";
    const formattedBody = isQaOrGasFinding ? details : markdownBody;
    const emailAddressList = additionalEmailAddresses.filter(
      (email) => !!email
    );
    emailAddressList.push(currentUser.emailAddress);

    const data: FindingRequestData = {
      user: currentUser.username,
      contest,
      sponsor,
      repo: repo.split("/").pop(),
      emailAddresses: emailAddressList,
      attributedTo,
      address: polygonAddress,
      risk: formattedRisk,
      title: getTitle(state.title, state.risk),
      body: formattedBody,
      labels: [config.labelAll, state.risk],
    };
    setStatus(FormStatus.Submitting);
    try {
      const response = await onSubmit(data);
      if (response.ok) {
        setStatus(FormStatus.Submitted);
        if (typeof window !== `undefined`) {
          window.localStorage.removeItem(findingId);
        }
      } else {
        const { error } = await response.json();
        if (error.startsWith("Failed to send confirmation email")) {
          setStatus(FormStatus.Submitted);
          if (typeof window !== `undefined`) {
            window.localStorage.removeItem(findingId);
          }
          toast.error(error);
        } else {
          setStatus(FormStatus.Error);
          if (error) {
            setErrorMessage(error);
          }
        }
      }
    } catch (error) {
      setStatus(FormStatus.Error);
      if (typeof error === "string") {
        setErrorMessage(error);
      }
    }
  }, [
    contest,
    currentUser,
    state,
    additionalEmailAddresses,
    polygonAddress,
    sponsor,
    repo,
    attributedTo,
  ]);

  const validator = useCallback(() => {
    if (!currentUser.isLoggedIn) {
      return true;
    }
    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);
    // extract required fields from field data for validation check
    const requiredFields = isQaOrGasFinding
      ? [state.risk, state.qaGasDetails]
      : [state.risk, state.title, state.details];
    const hasErrors = requiredFields.some((field) => {
      return field === "" || field === undefined;
    });

    if (hasErrors) {
      setHasValidationErrors(true);
      return true;
    }

    // @todo: better validation for polygon address
    if (!polygonAddress || polygonAddress.length !== 42) {
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
  }, [state, polygonAddress, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isInvalid = validator();
    if (isInvalid) {
      return;
    }

    const team = currentUser.teams.find(
      (team) => team.username === attributedTo
    );
    if (team && !team.address) {
      // confirm saving the team's address
      showModal({
        title: `Save address for team ${attributedTo}`,
        body: (
          <>
            <p>
              When you submit this finding, the polygon address you entered here
              will be saved for your team. Are you sure you entered it
              correctly?
            </p>
            <p>{polygonAddress}</p>
          </>
        ),
        primaryButtonAction: submitFinding,
        primaryButtonText: "Confirm and Submit",
        secondaryButtonText: "Close and Edit",
      });
    } else {
      submitFinding();
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={
        !isExpanded ? clsx(styles.Form) : clsx(styles.Form, styles.FormMax)
      }
    >
      <div className={clsx(styles.FormHeader)}>
        <h1 className={styles.Heading1}>{`${title} finding`}</h1>
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
            <h2 className={styles.Heading2}>User Info</h2>
            {currentUser.teams.length > 0 ? (
              <>
                <h3 className={widgetStyles.Label}>Submitting as</h3>
                <fieldset
                  className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}
                >
                  <h4 className={styles.Heading4}>WARDEN</h4>
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
                      image={currentUser.image}
                    />
                  </label>
                  <h4 className={styles.Heading4}>TEAM MEMBER</h4>
                  {currentUser.teams.map((team, i) => (
                    <>
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
                          image={team.image}
                        />
                      </label>
                      {!team.address && attributedTo === team.username && (
                        <div style={{ margin: "10px 0 0 40px" }}>
                          <label htmlFor={"newTeamAddress"}>
                            Team Polygon Address *
                          </label>
                          <input
                            className={clsx(
                              widgetStyles.Control,
                              widgetStyles.Text,
                              (!newTeamAddress ||
                                newTeamAddress.length !== 42) &&
                                hasValidationErrors &&
                                "input-error"
                            )}
                            type="text"
                            id={"newTeamAddress"}
                            placeholder="0x00000..."
                            value={newTeamAddress}
                            onChange={handleNewAddressChange}
                            maxLength={42}
                          />
                          {!newTeamAddress && hasValidationErrors && (
                            <p className={widgetStyles.ErrorMessage}>
                              <small>This field is required</small>
                            </p>
                          )}
                          {newTeamAddress.length !== 42 && hasValidationErrors && (
                            <p className={widgetStyles.ErrorMessage}>
                              <small>
                                Polygon address must be 42 characters long
                              </small>
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ))}
                </fieldset>
              </>
            ) : (
              <WardenDetails
                username={currentUser.username}
                address={currentUser.address}
                image={currentUser.image}
              />
            )}
            <DynamicInputGroup
              fields={additionalEmailAddresses}
              onChange={(emails) => setAdditionalEmailAddresses(emails)}
              fieldName="email address"
            >
              <label htmlFor="email" className={widgetStyles.Label}>
                Email
              </label>
              <p>{currentUser.emailAddress}</p>
            </DynamicInputGroup>
          </fieldset>
          <fieldset className={styles.EmphasizedInputGroup}>
            <h2 className={styles.Heading2}>Finding</h2>
            {fieldList.map((field, index) => {
              let isInvalid = false;
              if (field.name === "linksToCode") {
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
                  type={field.type}
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
        <div className="centered-text">
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
          <h2 className={styles.Heading2}>Thank you!</h2>
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
  );
};

export default SubmitFindings;
