import React, { useCallback, useState, useRef } from "react";
import clsx from "clsx";
import { useMoralis } from "react-moralis";
import Moralis from "moralis/types";

import useUser from "../hooks/UserContext";

import WardenField from "../components/reporter/widgets/WardenField";

import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

interface teamState {
  teamName: string;
  teamMembers: string[];
  link?: string;
  avatar?: File | null;
}

const initialState: teamState = {
  teamName: "",
  teamMembers: [],
  link: "",
  avatar: null,
};

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
}

function getFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const data = dataUrl.substr(dataUrl.indexOf(",") + 1);
      resolve(data);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function TeamRegistrationForm({
  handles,
  wardens,
  teams,
  updateErrorMessage,
  updateFormStatus,
  className,
}) {
  const [state, setState] = useState(initialState);
  const [isNewTeam, setIsNewUser] = useState(true);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>();
  const { logUserOut } = useUser();
  const { authenticate } = useMoralis();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setState((prevState) => {
        return { ...prevState, [name]: value };
      });
    },
    []
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length < 1) {
      setState((prevState) => {
        return { ...prevState, avatar: null };
      });
      return;
    }
    const file = e.target.files[0];
    setState((prevState) => {
      return { ...prevState, avatar: file };
    });
  };

  const removeAvatar = (): void => {
    if (!avatarInputRef || !avatarInputRef.current) {
      return;
    }
    avatarInputRef.current.value = "";
    setState((prevState) => {
      return { ...prevState, avatar: null };
    });
  };

  const submitRegistration = useCallback(
    (provider: Moralis.Web3ProviderType = "metamask"): void => {
      const url = `/.netlify/functions/register-warden`;

      (async () => {
        if (!state.teamName) {
          setHasValidationErrors(true);
          return;
        }
        if (state.teamMembers.length < 2) {
          setHasValidationErrors(true);
          return;
        }
        if (isNewTeam && handles.has(state.teamName)) {
          setHasValidationErrors(true);
          return;
        }
        setHasValidationErrors(false);
        updateFormStatus(FormStatus.Submitting);

        let image = undefined;
        try {
          if (state.avatar) {
            image = await getFileAsBase64(state.avatar);
          }
          const user = await authenticate({ provider });

          if (user === undefined) {
            // user does not have the corresponding browser extension
            // or user clicked "cancel" when prompted to sign message
            // or the account in question is not connected to the C4 site
            // @todo: update messaging
            updateFormStatus(FormStatus.Error);
            updateErrorMessage(
              `Make sure you have the ${provider} browser extension and the account is connected. ` +
                "You must sign the message to login. "
            );
            return;
          }

          const moralisId = user.id;
          const teamName = await user.get("c4Username");
          if (teamName) {
            await logUserOut();
            updateFormStatus(FormStatus.Error);
            if (teamName !== state.teamName) {
              // user tried to register more than one account with this address
              updateErrorMessage(
                `This address is already registered with the team "${teamName}"`
              );
            } else {
              // registration is pending
              // @todo: update messaging
              updateErrorMessage(
                "This team's registration is pending. " +
                  "Someone will reach out to a member of your " +
                  "team in Discord when your registration has been processed."
              );
            }
            return;
          }

          const requestBody = {
            handle: state.teamName,
            moralisId,
            members: state.teamMembers,
          } as {
            handle: string;
            moralisId: string;
            link?: string;
            image?: unknown;
            isUpdate?: boolean;
          };

          if (isNewTeam) {
            requestBody.link = state.link;
            requestBody.image = image;
          } else {
            requestBody.isUpdate = true;
          }

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            try {
              await user.set("c4Username", state.teamName);
              await user.set("members", state.teamMembers);
              // @todo: add role
              await user.save();
              await logUserOut();
            } catch (error) {
              await logUserOut();
              updateFormStatus(FormStatus.Error);
              updateErrorMessage("");
              console.error(error);
            }
            updateFormStatus(FormStatus.Submitted);
          } else {
            updateFormStatus(FormStatus.Error);
            try {
              const res = await response.json();
              updateErrorMessage(res.error);
            } catch (error) {
              updateErrorMessage("");
            }
          }
        } catch (error) {
          updateFormStatus(FormStatus.Error);
          updateErrorMessage(error);
        }
      })();
    },
    [avatarInputRef, state, isNewTeam, hasValidationErrors]
  );

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsNewUser(event.target.value === "newTeam");
    setState((prevState) => {
      return { ...prevState, teamName: "", teamMembers: [] };
    });
  };

  return (
    <form className={className}>
      <fieldset className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}>
        <label>
          <input
            className={widgetStyles.Radio}
            type="radio"
            value="newTeam"
            name="isNewTeam"
            checked={isNewTeam}
            onChange={handleFormChange}
          />
          I'm forming a new team
        </label>
        <label>
          <input
            className={widgetStyles.Radio}
            type="radio"
            value="establishedTeam"
            name="isNewTeam"
            checked={!isNewTeam}
            onChange={handleFormChange}
          />
          I already have an established team
        </label>
      </fieldset>
      {isNewTeam ? (
        <>
          <div className={widgetStyles.Container}>
            <label htmlFor="teamName" className={widgetStyles.Label}>
              Team Name
            </label>
            <p className={widgetStyles.Help}>
              Used to report findings, as well as display your total award
              amount on the leaderboard. Supports alphanumeric characters,
              underscores, and hyphens.
            </p>
            <input
              className={clsx(
                widgetStyles.Control,
                widgetStyles.Text,
                hasValidationErrors &&
                  (!state.teamName ||
                    (isNewTeam && handles.has(state.teamName))) &&
                  "input-error"
              )}
              style={{ marginBottom: 0 }}
              type="text"
              id="teamName"
              name="teamName"
              placeholder="Team Name"
              value={state.teamName}
              onChange={handleChange}
              maxLength={25}
            />
            {handles.has(state.teamName) && (
              <p className={widgetStyles.ErrorMessage}>
                <small>{`${state.teamName} is already registered as a team or warden.`}</small>
              </p>
            )}
            {hasValidationErrors && !state.teamName && (
              <p className={widgetStyles.ErrorMessage}>
                <small>This field is required</small>
              </p>
            )}
          </div>
        </>
      ) : (
        <div className={widgetStyles.Container}>
          <label className={widgetStyles.Label}>Team Name</label>
          <p className={widgetStyles.Help}>
            The teamName you use to submit your findings
          </p>
          <WardenField
            options={teams}
            onChange={(e) => {
              setState((state) => {
                return {
                  ...state,
                  teamName: e.target.value,
                  teamMembers: e.target.members,
                };
              });
            }}
            fieldState={state}
            isInvalid={
              (hasValidationErrors && !state.teamName) ||
              (state.teamName && !state.teamMembers.length)
            }
          />
          {hasValidationErrors && !state.teamName && (
            <p className={widgetStyles.ErrorMessage}>
              <small>This field is required</small>
            </p>
          )}
        </div>
      )}
      {isNewTeam && (
        <>
          <div className={widgetStyles.Container}>
            <label className={widgetStyles.Label}>Members</label>
            <WardenField
              options={wardens}
              onChange={(e) => {
                setState((state) => {
                  return {
                    ...state,
                    teamMembers: e.target.value || [],
                  };
                });
              }}
              fieldState={state}
              isInvalid={hasValidationErrors && state.teamMembers.length < 2}
              isMulti={true}
            />
            {hasValidationErrors && state.teamMembers.length < 2 && (
              <p className={widgetStyles.ErrorMessage}>
                <small>You must have at least 2 members on a team</small>
              </p>
            )}
          </div>
          <div className={widgetStyles.Container}>
            <label htmlFor="link" className={widgetStyles.Label}>
              Link (Optional)
            </label>
            <p className={widgetStyles.Help}>
              Link your leaderboard entry to a personal website or social media
              account.
            </p>
            <input
              className={clsx(widgetStyles.Control, widgetStyles.Text)}
              type="text"
              id="link"
              name="link"
              placeholder="https://twitter.com/code4rena"
              value={state.link}
              onChange={handleChange}
            />
          </div>
          <div className={widgetStyles.Container}>
            <label htmlFor="avatar" className={widgetStyles.Label}>
              Avatar (Optional)
            </label>
            <p className={widgetStyles.Help}>
              An avatar displayed next to your name on the leaderboard.
            </p>
            <input
              className={widgetStyles.Avatar}
              type="file"
              id="avatar"
              name="avatar"
              accept=".png,.jpg,.jpeg,.webp"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
            {state.avatar && (
              <button
                className="remove-line-button"
                type="button"
                onClick={removeAvatar}
                aria-label="Remove avatar"
              >
                &#x2715;
              </button>
            )}
          </div>
        </>
      )}
      <div className={styles.ButtonsWrapper}>
        <button
          className={clsx("button cta-button", styles.Button)}
          type="button"
          onClick={() => submitRegistration()}
        >
          Register with MetaMask
        </button>
        <button
          className={clsx("button cta-button", styles.Button)}
          type="button"
          onClick={() => submitRegistration("walletConnect")}
        >
          Register with WalletConnect
        </button>
      </div>
    </form>
  );
}
