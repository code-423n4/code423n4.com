import React, { useCallback, useState, useRef } from "react";
import clsx from "clsx";

import useUser from "../hooks/UserContext";

import WardenField from "../components/reporter/widgets/WardenField";

import * as styles from "../components/form/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";
import { navigate } from "gatsby";

interface teamState {
  teamName: string;
  polygonAddress: string;
  link?: string;
  avatar?: File | null;
}

const initialState: teamState = {
  teamName: "",
  link: "",
  avatar: null,
  polygonAddress: "",
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
  updateErrorMessage,
  formStatus,
  updateFormStatus,
  className,
}) {
  const { currentUser } = useUser();
  const [state, setState] = useState(initialState);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    { value: string; image: string }[]
  >([wardens.find((warden) => warden.value === currentUser.username)]);
  const avatarInputRef = useRef<HTMLInputElement>();

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

  const submitRegistration = useCallback((): void => {
    const url = `/.netlify/functions/register-team`;
    if (!currentUser.isLoggedIn) {
      navigate("/");
    }

    (async () => {
      if (
        !state.teamName ||
        teamMembers.length < 2 ||
        handles.has(state.teamName) ||
        !teamMembers.find((member) => member.value === currentUser.username)
      ) {
        setHasValidationErrors(true);
        return;
      }
      setHasValidationErrors(false);
      updateFormStatus(FormStatus.Submitting);

      let image = undefined;
      try {
        const members = teamMembers.map((member) => member.value);

        if (state.avatar) {
          image = await getFileAsBase64(state.avatar);
        }

        const requestBody = {
          teamName: state.teamName,
          members,
          link: state.link,
          image,
          address: state.polygonAddress,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          updateFormStatus(FormStatus.Submitted);
        } else {
          const res = await response.json();
          updateErrorMessage(res.error || "");
          updateFormStatus(FormStatus.Error);
        }
      } catch (error) {
        updateErrorMessage(error.message || "");
        updateFormStatus(FormStatus.Error);
        console.error(error);
      }
    })();
  }, [
    avatarInputRef,
    state,
    hasValidationErrors,
    currentUser,
    teamMembers,
    handles,
  ]);

  return (
    <form className={className}>
      <div className={widgetStyles.Container}>
        <label htmlFor="teamName" className={widgetStyles.Label}>
          Team Name *
        </label>
        <p className={widgetStyles.Help}>
          Used to report findings, as well as display your total award amount on
          the leaderboard. Supports alphanumeric characters, underscores, and
          hyphens.
        </p>
        <input
          className={clsx(
            widgetStyles.Control,
            widgetStyles.Text,
            hasValidationErrors &&
              (!state.teamName || handles.has(state.teamName)) &&
              "input-error"
          )}
          style={{ marginBottom: 0 }}
          type="text"
          id="teamName"
          name="teamName"
          placeholder="TeamName"
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
      <div className={widgetStyles.Container}>
        <label className={widgetStyles.Label}>Members *</label>
        {/* @todo: make current user a fixed option */}
        <WardenField
          name="teamMembers"
          required={true}
          options={wardens}
          onChange={(e) => {
            setTeamMembers(e.target.value || []);
          }}
          fieldState={teamMembers}
          isInvalid={hasValidationErrors && teamMembers.length < 2}
          isMulti={true}
        />
        {hasValidationErrors && teamMembers.length < 2 && (
          <p className={widgetStyles.ErrorMessage}>
            <small>You must have at least 2 members on a team</small>
          </p>
        )}
        {hasValidationErrors &&
          !teamMembers.find(
            (member) => member.value === currentUser.username
          ) && (
            <p className={widgetStyles.ErrorMessage}>
              <small>You must add yourself to the team you are creating</small>
            </p>
          )}
      </div>
      <div className={widgetStyles.Container}>
        <label htmlFor="polygonAddress" className={widgetStyles.Label}>
          Polygon Address *
        </label>
        <p className={widgetStyles.Help}>
          Address where your team's prize should go. If you use a smart contract
          wallet, please contact one of our organizers in Discord in addition to
          adding the address here.
        </p>
        <input
          className={clsx(
            widgetStyles.Control,
            widgetStyles.Text,
            hasValidationErrors && !state.polygonAddress && "input-error"
          )}
          type="text"
          id="polygonAddress"
          name="polygonAddress"
          placeholder="0x00000..."
          value={state.polygonAddress}
          onChange={handleChange}
        />
        {hasValidationErrors && !state.polygonAddress && (
          <p className={widgetStyles.ErrorMessage}>
            <small>This field is required</small>
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
      <div className={styles.ButtonsWrapper}>
        <button
          className={clsx("button cta-button", styles.Button)}
          type="button"
          onClick={submitRegistration}
        >
          {formStatus === FormStatus.Submitting
            ? "Submitting..."
            : "Register Team"}
        </button>
      </div>
    </form>
  );
}
