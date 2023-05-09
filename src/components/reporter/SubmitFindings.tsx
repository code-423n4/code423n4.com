import clsx from "clsx";
import { navigate } from "@reach/router";
import { Link } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// types
import { Field } from "./widgets/Widgets";
import { ContestNumber } from "../../../types/shared";
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
  mitigationOfField,
  issueTypeListField,
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

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Deleting = "deleting",
  Error = "error",
}

interface SubmitFindingsProps {
  sponsor: string;
  contest: ContestNumber;
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
      fieldList = [mitigationOfField, mitigationField];
      if (state.isMitigated) {
        fieldList.push(qaGasDetailsField);
        setFieldList(fieldList);
        return;
      }
      fieldList.push(mitigationRiskField);
      if (!state.risk) {
        setFieldList(fieldList);
        return;
      }
      setFieldList(
        fieldList.concat([
          titleField,
          linksToCodeField,
          vulnerabilityDetailsField,
          issueTypeListField,
        ])
      );
      return;
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
          issueTypeListField,
        ])
      );
    }
  }, [state.risk, currentUser, state.isMitigated, state.issueType]);

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
    const markdownBody = `# Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${
      state.details
    }${
      !isQaOrGasFinding ? `\n\n\n## Assessed type\n\n${state.issueType}` : ""
    }`;
    let risk = state.risk;
    let title = getTitle(state.title, state.risk);
    let body = markdownBody;
    let labels = [config.labelAll, state.risk];

    let mitigationOf: string | undefined = state.mitigationOf;

    if (isQaOrGasFinding) {
      body = state.qaGasDetails;
    }

    if (contestType === "Mitigation review") {
      mitigationOf = state.mitigationOf;
      labels = [state.risk];
      if (state.isMitigated) {
        body = state.qaGasDetails;
        title = "";
        risk = "";
        labels = [];
      }
    }
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
      risk,
      title,
      body,
      labels,
      mitigationOf,
      isMitigated: state.isMitigated,
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
        const res = await response.text();
        if (res.startsWith("Timeout")) {
          setStatus(FormStatus.Error);
          setErrorMessage(
            "Your request timed out. However, this does not necessarily " +
              "mean your finding was not submitted. Please check the findings " +
              "tab on the contest page. If you don't see your submission there, " +
              "then please try again."
          );
        } else {
          const { error } = JSON.parse(res);
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
    let requiredFields = [
      state.risk,
      state.title,
      state.details,
      state.issueType,
    ];
    if (isQaOrGasFinding) {
      requiredFields = [state.risk, state.qaGasDetails];
    }
    if (contestType === "Mitigation review") {
      if (state.isMitigated) {
        // if the finding is mitigated, we only need "mitigation of"
        if (!state.mitigationOf || !state.qaGasDetails) {
          setHasValidationErrors(true);
          return true;
        } else {
          return false;
        }
      } else {
        requiredFields.push(state.mitigationOf);
      }
    }
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
    <div className="limited-width form submit-findings">
      <h1>{`${title} finding`}</h1>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Deleting ||
        status === FormStatus.Submitting) && (
        <form>
          <div className="submit-findings__user-info">
            <h2>User Info</h2>
            {currentUser.teams.length > 0 ? (
              <>
                <h3>Submitting as</h3>
                <fieldset className="submit-findings__submitting-as">
                  <h4>Warden</h4>
                  <label className="form__radio">
                    <input
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
                  <h4>Team Member</h4>
                  {currentUser.teams.map((team, i) => (
                    <>
                      <label key={team.username} className="form__radio">
                        <input
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
                            <p>
                              <small>This field is required</small>
                            </p>
                          )}
                          {newTeamAddress.length !== 42 && hasValidationErrors && (
                            <p>
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
              />
            )}
            <fieldset>
              <DynamicInputGroup
                fields={additionalEmailAddresses}
                onChange={(emails) => setAdditionalEmailAddresses(emails)}
                fieldName="email address"
              >
                <label htmlFor="email">Email</label>
                <p>{currentUser.emailAddress}</p>
              </DynamicInputGroup>
            </fieldset>
          </div>
          <fieldset>
            <h2>
              {contestType === "Mitigation review"
                ? "Mitigation Review"
                : "Finding"}
            </h2>
            {fieldList.map((field, index) => {
              let isInvalid = false;
              if (field.name === "linksToCode") {
                isInvalid = hasValidationErrors;
              } else {
                isInvalid = hasValidationErrors && !state[field.name];
              }
              return field.widget === "checkbox" ? (
                <Widget
                  field={field}
                  onChange={handleChange}
                  fieldState={state}
                  isInvalid={false}
                />
              ) : (
                <FormField
                  required={field.required}
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
          <div className="form__submit-button-holder">
            {cancelButtonText && (
              <button
                className="button button--secondary"
                type="button"
                onClick={handleCancel}
              >
                {cancelButtonText}
              </button>
            )}
            {onDelete && (
              <button
                className="button button--danger"
                type="button"
                onClick={handleDeleteClick}
              >
                {status === FormStatus.Deleting
                  ? "Withdrawing..."
                  : "Withdraw finding"}
              </button>
            )}
            <button
              className="button button--primary form__submit-button"
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
        <div className="spacing-top__xl">
          <p>{errorMessage}</p>
          <button
            className="button button--primary form__submit-button"
            type="button"
            onClick={() => setStatus(FormStatus.Unsubmitted)}
          >
            Try again
          </button>
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div className="spacing-top__xl">
          <h2>Thank you!</h2>
          <p className="spacing-bottom__m">{successMessage}</p>
          <div>
            <Link to={contestPath} className="button button--secondary">
              Back to contest
            </Link>
            {successButtonText && (
              <button
                className="button button--primary"
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
