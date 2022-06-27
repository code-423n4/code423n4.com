import clsx from "clsx";
import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { useModalContext } from "../hooks/ModalContext";
import useUser from "../hooks/UserContext";

import { Input } from "../components/Input";
import ProtectedPage from "../components/ProtectedPage";

import * as styles from "../components/form/Form.module.scss";
import * as inputStyles from "../components/Input.module.scss";

const initialState = {
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
};

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
}

export default function ConfirmAccount() {
  // hooks
  const { isInitialized, isInitializing, user } = useMoralis();
  const { currentUser, reFetchUser, logUserOut } = useUser();
  const { showModal } = useModalContext();

  // state
  const [state, setState] = useState<Record<string, string>>(initialState);
  const [username, setUsername] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [wardenInfoStatus, setWardenInfoFormStatus] = useState<FormStatus>(
    FormStatus.Unsubmitted
  );
  const [usernameFormStatus, setUsernameFormStatus] = useState<FormStatus>(
    FormStatus.Unsubmitted
  );

  const getUser = async (): Promise<void> => {
    const { discordUsername, gitHubUsername, emailAddress } = currentUser;
    const accounts = await user.get("accounts");
    setAddresses(accounts || []);
    setState({ discordUsername, gitHubUsername, emailAddress });
  };

  useEffect(() => {
    if (!isInitialized || !user) {
      return;
    }
    getUser();
    resetUsername();
  }, [currentUser, isInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateDiscordUsername = (value) => {
    const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");
    const isValid = discordUsernameRegex.test(value);
    if (!isValid) {
      return [
        "Make sure you enter your discord username, " +
          "and not your server nickname. It should end with '#' " +
          "followed by 4 digits.",
      ];
    }
    return [];
  };

  const validateUsername = (value) => {
    const errors = [];
    if (value.length > 25) {
      errors.push("Length is limited to 25 characters.");
    }
    if (value.match(/^[0-9a-zA-Z_\-]+$/) === null) {
      errors.push(
        "Can only contain alphanumeric characters, underscores, and hyphens"
      );
    }
    return errors;
  };

  const handleSaveWardenInfo = async () => {
    if (!user) {
      return;
    }

    if (
      !state.discordUsername ||
      !state.gitHubUsername ||
      !state.emailAddress
    ) {
      return;
    }

    const discordValidationErrors = validateDiscordUsername(
      state.discordUsername
    );
    if (discordValidationErrors.length > 0) {
      return;
    }

    setWardenInfoFormStatus(FormStatus.Submitting);

    user.set("discordUsername", state.discordUsername);
    user.set("gitHubUsername", state.gitHubUsername);
    user.set("emailAddress", state.emailAddress);

    try {
      await user.save();
      await reFetchUser();
      toast.success("Your information has been updated");
      setWardenInfoFormStatus(FormStatus.Submitted);
    } catch (error) {
      setWardenInfoFormStatus(FormStatus.Error);
      toast.error("An error occurred. Your changes have not been saved");
    }
  };

  const handleSaveUsername = async () => {
    if (username === currentUser.username) {
      return;
    }

    const usernameValidationErrors = validateUsername(username);
    if (!username || usernameValidationErrors.length > 0) {
      return;
    }

    setUsernameFormStatus(FormStatus.Submitting);
    showModal({
      title: `Are you sure you want to change your username to "${username}"?`,
      body: (
        <>
          <ul>
            <h3>If you change your username:</h3>
            <li>
              Your previous leaderboard stats will still be linked to the name "
              {currentUser.username}"
            </li>
            <li>
              Your previous findings in contest reports will still be attributed
              to "{currentUser.username}"
            </li>
            <li>
              You will be blocked from submitting findings for a short period of
              time while we review and approve your request.
            </li>
          </ul>
        </>
      ),
      primaryButtonText: "Change username",
      primaryButtonAction: async () => await saveUsername(),
      secondaryButtonAction: async () =>
        setUsernameFormStatus(FormStatus.Unsubmitted),
    });
  };

  const saveUsername = async () => {
    try {
      const url = `/.netlify/functions/update-user`;
      const requestBody = {
        newUsername: username,
        username: currentUser.username,
        polygonAddress: currentUser.address,
        gitHubUsername: currentUser.gitHubUsername,
      };

      const sessionToken = user.attributes.sessionToken;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const { error } = await response.json();
        console.error(error);
        throw "Saving username failed";
      }

      user.set("c4Username", username);
      await user.save();

      toast.success(
        "Your request to change your username has been submitted. You have been logged out."
      );
      await logUserOut();
      setUsernameFormStatus(FormStatus.Submitted);
    } catch (error) {
      setUsernameFormStatus(FormStatus.Error);
      toast.error("An error occurred. Your changes have not been saved");
    }
  };

  const resetWardenInfo = (): void => {
    getUser();
  };

  const resetUsername = (): void => {
    const { username } = currentUser;
    setUsername(username);
  };

  return (
    <ProtectedPage pageTitle="My Account | Code 423n4">
      {isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="wrapper-main">
          <h1 className="page-header">Manage Account</h1>
          <form className={clsx(styles.Form)}>
            <h2 className={styles.Heading2}>Warden Information</h2>
            <span className={inputStyles.Label}>Addresses:</span>
            <ul>
              {addresses.map((address) => (
                <li>{address}</li>
              ))}
            </ul>
            <Input
              label="Discord Username:"
              handleChange={handleChange}
              value={state.discordUsername}
              name="discordUsername"
              required={true}
              validator={validateDiscordUsername}
            />
            <Input
              label="Github Username:"
              handleChange={handleChange}
              value={state.gitHubUsername}
              name="gitHubUsername"
              required={true}
            />
            <Input
              label="Email Address:"
              handleChange={handleChange}
              value={state.emailAddress}
              name="emailAddress"
              required={true}
            />
            <div className={styles.ButtonsWrapper}>
              <button
                type="button"
                className="button cta-button secondary"
                onClick={resetWardenInfo}
                disabled={wardenInfoStatus === FormStatus.Submitting}
              >
                Clear Changes
              </button>
              <button
                type="button"
                className="button cta-button"
                onClick={handleSaveWardenInfo}
                disabled={wardenInfoStatus === FormStatus.Submitting}
              >
                {wardenInfoStatus === FormStatus.Submitting
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
            <div className={styles.DividingLine}></div>
            <h2 className={styles.Heading2}>Teams</h2>
            <p>Team Management coming soon!</p>
            <p>
              If you need help with managing your team in the meantime,{" "}
              <Link to="/help">contact us</Link>.
            </p>
            <span className={inputStyles.Label}>Your Teams:</span>
            <p>
              {(currentUser.teams || []).length === 0
                ? "You are not a member of any teams"
                : currentUser.teams.map((e) => e.username).join(", ")}
            </p>
            <div className={styles.ButtonsWrapper}>
              <Link
                to="/register-team"
                className="button cta-button centered secondary"
              >
                Create a new team
              </Link>
            </div>
            <fieldset className={styles.EmphasizedInputGroup}>
              <h2 className={styles.Heading2}>Username</h2>
              <p className="warning-message">
                <p>
                  🚨 WARNING: your code4rena username is tied to any findings
                  you may have submitted in the past. If you change your
                  username, your old username will still be linked to your
                  previous findings on the leaderboard and in past reports.
                  Changing your username will effectively be like starting over.
                </p>
                <p>
                  Additionally, changing your username requires approval from
                  the the code4rena team. Once you submit the request, you will
                  be blocked from submitting findings until the change has been
                  reviewed and approved.
                </p>
              </p>
              <Input
                label="Code4rena Username:"
                handleChange={(e) => setUsername(e.target.value)}
                value={username}
                name="username"
                required={true}
                validator={validateUsername}
              />
              <div className={styles.ButtonsWrapper}>
                <button
                  type="button"
                  className="button cta-button secondary"
                  onClick={resetUsername}
                  disabled={usernameFormStatus === FormStatus.Submitting}
                >
                  Clear Changes
                </button>
                <button
                  type="button"
                  className="button cta-button danger"
                  onClick={handleSaveUsername}
                >
                  {usernameFormStatus === FormStatus.Submitting
                    ? "Saving..."
                    : "Save Username"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </ProtectedPage>
  );
}
