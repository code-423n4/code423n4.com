import clsx from "clsx";
import { navigate } from "@reach/router";
import { Link } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// types
import { Field } from "./widgets/Widgets";
import { ReportState } from "../../templates/ReportForm";
import { FindingCreateRequest } from "../../../types/finding";

// helpers
import {
  titleField,
  riskField,
  linksToCodeField,
  vulnerabilityDetailsField,
  qaGasDetailsField,
  mitigationField,
  mitigationRiskField,
} from "./findings/fields";
import {
  config,
  getTitle,
  checkQaOrGasFinding,
  getCurrentStateFromStorage,
  setStateInLocalStorage,
} from "./findings/functions";

// hooks
import useUser from "../../hooks/UserContext";
import { ModalProps, useModalContext } from "../../hooks/ModalContext";

// components
import Agreement from "../content/Agreement";
import { DynamicInputGroup } from "../DynamicInputGroup";
import FormField from "./widgets/FormField";
import WardenDetails from "../WardenDetails";
import Widget from "./widgets/Widget";

// styles
import * as styles from "../form/Form.module.scss";
import * as widgetStyles from "../reporter/widgets/Widgets.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Deleting = "deleting",
  Error = "error",
}

interface SubmitFindingsProps {
  sponsor: string;
  contest: string;
  contestPath: string;
  repo: string;
  title: string;
  initialState: ReportState;
  onSubmit: (data: FindingCreateRequest) => Promise<Response>;
  findingId: string;
  initialAttributedTo: string;
  submitButtonText: string;
  successMessage: string;
  successButtonText?: string;
  cancelButtonText?: string;
  contestType: "Mitigation review" | "Audit";
  onDelete?: () => Promise<void>;
}

// @todo for Mitigation Review:
// 1. add fields relevant to mitigation review
// 2. update submit data to support mitigation reviews

const SubmitFindings = ({
  sponsor,
  contest,
  contestPath,
  repo,
  title,
  initialState,
  onSubmit,
  findingId,
  initialAttributedTo,
  submitButtonText,
  successMessage,
  successButtonText,
  cancelButtonText,
  contestType,
  onDelete,
}: SubmitFindingsProps) => {
  // hooks
  const { currentUser, reFetchUser } = useUser();
  const { showModal } = useModalContext();

  // state
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [hasValidationErrors, setHasValidationErrors] = useState<boolean>(
    false
  );
  const [errorMessage, setErrorMessage] = useState<string>("An error occurred");
  const [state, setState] = useState<ReportState>(initialState);
  const [additionalEmailAddresses, setAdditionalEmailAddresses] = useState<
    string[]
  >([]);
  const [newTeamAddress, setNewTeamAddress] = useState<string>("");
  const [attributedTo, setAttributedTo] = useState<string>(initialAttributedTo);
  const [fieldList, setFieldList] = useState<Field[]>([riskField]);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);

  // effects
  useEffect(() => {
    if (!attributedTo) {
      setAttributedTo(initialAttributedTo);
    }
  }, [initialAttributedTo]);

  useEffect(() => {
    const currentState = getCurrentStateFromStorage(findingId, initialState);
    setState(currentState);
  }, [findingId, initialState]);

  useEffect(() => {
    // set which fields are shown based on risk and audit type
    let fieldList: Field[] = [riskField];
    if (contestType === "Mitigation review") {
      // if the type is mitigation review, include checkbox to
      // toggle mitigation confirmed
      // if mitigation confirmed is checked, hide risk field
      fieldList = [mitigationField];
      if (!isMitigated) {
        fieldList.push(mitigationRiskField);
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
        return;
      } else {
        setFieldList([mitigationField]);
        return;
      }
    } else {
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
    }
  }, [state.risk, currentUser, isMitigated]);

  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      return;
    }
    // @todo: make chain dynamic based on contest
    if (!currentUser.polygonPaymentAddress) {
      showPaymentAddressModal();
    }
  }, [currentUser]);

  // change handlers
  const handleChange = (e) => {
    if (Array.isArray(e)) {
      setState((prevState) => {
        const newState = { ...prevState, linksToCode: e };
        setStateInLocalStorage(findingId, newState);
        return newState;
      });
    } else {
      const { name, value } = e.target;
      switch (name) {
        case "title":
          setState((prevState) => {
            const newState = {
              ...prevState,
              [name]: getTitle(value, prevState.risk),
            };
            setStateInLocalStorage(findingId, newState);
            return newState;
          });
          break;
        case "isMitigated":
          setState((prevState) => {
            const newState = {
              ...prevState,
              [name]: !prevState.isMitigated,
            };
            setStateInLocalStorage(findingId, newState);
            return newState;
          });
          break;
        default:
          setState((prevState) => {
            const newState = { ...prevState, [name]: value };
            setStateInLocalStorage(findingId, newState);
            return newState;
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
    } else {
      setAttributedTo(currentUser.username);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewTeamAddress(e.target.value);
  };

  const handleReset = () => {
    setState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };

  const handleCancel = (): void => {
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem(findingId);
    }
    setState(initialState);
  };

  const handleDeleteClick = async () => {
    if (!onDelete) {
      return;
    }
    showModal({
      title: "Withdraw Finding",
      body: "Are you sure you want to withdraw this finding?",
      primaryButtonAction: handleDelete,
      primaryButtonText: "Withdraw",
    });
  };

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!onDelete) {
      return;
    }
    setStatus(FormStatus.Deleting);
    try {
      await onDelete();
      if (typeof window !== `undefined`) {
        window.localStorage.removeItem(findingId);
      }
      // clear location state
      navigate("", { state: {} });
      setStatus(FormStatus.Submitted);
    } catch (error) {
      setStatus(FormStatus.Error);
      setErrorMessage(error);
    }
  }, [status]);

  const showPaymentAddressModal = async () => {
    const modalProps: Partial<ModalProps> = {
      title: "Please save a payment address",
      body: (
        <>
          It looks like you don't have a payment address saved for your account.
          Please update your payment information before submitting findings.
        </>
      ),
      primaryButtonAction: async () => {
        navigate("/account");
      },
      primaryButtonText: "Update Payment Info",
    };

    const user = await Moralis.User.current();
    const authAddress = await user?.get("ethAddress");
    if (authAddress) {
      modalProps.body = (
        <>Would you like to use {authAddress} for payment on Polygon?</>
      );
      modalProps.primaryButtonAction = saveAuthAddressAsPaymentAddress;
      modalProps.primaryButtonText = "Save Address";
      modalProps.secondaryButtonText = "Update Payment Information";
      modalProps.secondaryButtonAction = async () => {
        navigate("/account");
      };
    }
    showModal(modalProps as ModalProps);
  };

  const saveAuthAddressAsPaymentAddress = async (): Promise<void> => {
    try {
      const user = await Moralis.User.current();
      const authAddress = await user?.get("ethAddress");
      await Moralis.Cloud.run("addPaymentAddress", {
        address: authAddress,
        chain: "polygon",
      });
      await reFetchUser();
      toast.success(`Your Polygon payment address has been saved`);
    } catch (error) {
      toast.error(
        <>
          An error occurred and your payment address has not been saved:{" "}
          {error.message}
          <br />
          Go to your <Link to="/account">account management page</Link> to
          update your payment information
        </>
      );
    }
  };

  const submitFinding = useCallback(async () => {
    const isQaOrGasFinding = checkQaOrGasFinding(state.risk);
    const linksToCodeString = state.linksToCode.join("\n");
    const details = isQaOrGasFinding ? state.qaGasDetails : state.details;
    const markdownBody = `# Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${details}`;
    const formattedBody = isQaOrGasFinding ? details : markdownBody;
    const emailAddressList: string[] = additionalEmailAddresses.filter(
      (email) => !!email
    );
    emailAddressList.push(currentUser.emailAddress);

    const data: FindingCreateRequest = {
      user: currentUser.username,
      contest,
      sponsor,
      repo: repo.split("/").pop() || "",
      emailAddresses: emailAddressList,
      attributedTo,
      risk: state.risk,
      title: getTitle(state.title, state.risk),
      body: formattedBody,
      labels: [config.labelAll, state.risk],
    };
    if (attributedTo !== currentUser.username) {
      const team = currentUser.teams.find(
        (team) => team.username === attributedTo
      );
      data.address = team?.polygonAddress || newTeamAddress;
    }

    setStatus(FormStatus.Submitting);
    try {
      const response = await onSubmit(data);
      if (response.ok) {
        setStatus(FormStatus.Submitted);
        if (typeof window !== `undefined`) {
          window.localStorage.removeItem(findingId);
        }
        // clear location state
        navigate("", { state: {} });
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
          setErrorMessage(error);
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
    newTeamAddress,
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
    // @todo: make chain dynamic based on contest
    if (attributedTo !== currentUser.username) {
      const team = currentUser.teams.find(
        (team) => team.username === attributedTo
      );
      if (
        !team ||
        (!team.polygonAddress &&
          (!newTeamAddress || newTeamAddress.length !== 42))
      ) {
        return true;
      }
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
  }, [state, newTeamAddress, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isInvalid = validator();
    if (isInvalid) {
      return;
    }

    if (!currentUser.polygonPaymentAddress) {
      await showPaymentAddressModal();
      return;
    }

    const team = currentUser.teams.find(
      (team) => team.username === attributedTo
    );
    if (team && !team.polygonAddress) {
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
            <p>{newTeamAddress}</p>
          </>
        ),
        primaryButtonAction: submitFinding,
        primaryButtonText: "Confirm and Submit",
        secondaryButtonText: "Close and Edit",
      });
    } else {
      submitFinding();
    }
  };

  return (
    <div className={styles.Form}>
      <h1 className={styles.Heading1}>{`${title} finding`}</h1>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Deleting ||
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
                          image={team.image}
                        />
                      </label>
                      {/* @todo: remove this once all teams have saved a payment address */}
                      {!team.polygonAddress && attributedTo === team.username && (
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
                image={currentUser.image}
                className={widgetStyles.Container}
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
          <div className={styles.ButtonsWrapper}>
            {cancelButtonText && (
              <button
                className="button cta-button secondary"
                type="button"
                onClick={handleCancel}
              >
                {cancelButtonText}
              </button>
            )}
            {onDelete && (
              <button
                className="button cta-button danger"
                type="button"
                onClick={handleDeleteClick}
              >
                {status === FormStatus.Deleting
                  ? "Withdrawing..."
                  : "Withdraw finding"}
              </button>
            )}
            <button
              className="button cta-button"
              type="button"
              onClick={handleSubmit}
              disabled={status !== FormStatus.Unsubmitted}
            >
              {status === FormStatus.Submitting
                ? "Submitting..."
                : submitButtonText}
            </button>
          </div>
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
          <p>{successMessage}</p>
          <div className={styles.ButtonsWrapper}>
            <Link to={contestPath} className="button cta-button secondary">
              Back to contest
            </Link>
            {successButtonText && (
              <button
                className="button cta-button"
                type="button"
                onClick={handleReset}
              >
                Submit another
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitFindings;
