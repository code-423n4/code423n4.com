import clsx from "clsx";
import { Link, navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";
import { Input } from "../components/Input";

import * as styles from "../components/form/Form.module.scss";
import * as inputStyles from "../components/Input.module.scss";

const initialState = {
  username: "",
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
  const { currentUser, reFetchUser } = useUser();

  // state
  const [state, setState] = useState(initialState);
  const [contactInfoFormStatus, setContactInfoFormStatus] = useState(
    FormStatus.Unsubmitted
  );
  const [usernameFormStatus, setUsernameFormStatus] = useState(
    FormStatus.Unsubmitted
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const getUser = async (): Promise<void> => {
      const {
        username,
        discordUsername,
        gitHubUsername,
        emailAddress,
      } = currentUser;
      setState({ username, discordUsername, gitHubUsername, emailAddress });
    };
    getUser();
  }, [currentUser, isInitialized]);

  const handleChange = (e) => {
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

  const handleSaveContactInfo = async () => {
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

    setContactInfoFormStatus(FormStatus.Submitting);

    user.set("discordUsername", state.discordUsername);
    user.set("gitHubUsername", state.gitHubUsername);
    user.set("emailAddress", state.emailAddress);
    await user.save();
    await reFetchUser();
    toast.success("Contact information has been updated");
    setContactInfoFormStatus(FormStatus.Submitted);
  };

  const handleSaveUsername = async () => {
    const usernameValidationErrors = validateUsername(state.username);
    if (!state.username || usernameValidationErrors.length > 0) {
      return;
    }

    setUsernameFormStatus(FormStatus.Submitting);

    const url = `/.netlify/functions/update-user`;
    // @todo: write endpoint for updating user info

    user.set("c4Username", state.username);
    await user.save();
    await reFetchUser();
    toast.success("Your request to change your username has been submitted");
    setUsernameFormStatus(FormStatus.Submitted);
  };

  return (
    <DefaultLayout>
      {isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="wrapper-main">
          <h1 className="page-header">Manage Account</h1>
          <form className={clsx(styles.Form)}>
            <h2 className={styles.Heading2}>Contact Information</h2>
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
            <button
              type="button"
              className="button cta-button centered"
              onClick={handleSaveContactInfo}
            >
              {contactInfoFormStatus === FormStatus.Submitting
                ? "Saving..."
                : "Save contact information"}
            </button>
            <fieldset className={styles.PrimaryInputGroup}>
              <h2 className={styles.Heading2}>Danger Zone</h2>
              <Input
                label="Code4rena Username:"
                helpText={
                  <>
                    <p>
                      WARNING: your code4rena username is tied to any findings
                      you may have submitted in the past. If you change your
                      username, your old username will still be linked to your
                      previous findings on the leaderboard. Changing your
                      username will effectively be like starting over.
                    </p>
                    <p>
                      Additionally, changing your username requires approval
                      from the the code4rena team. Once you submit the request,
                      you will be blocked from submitting findings until the
                      change has been reviewed and approved.
                    </p>
                  </>
                }
                handleChange={handleChange}
                value={state.username}
                name="username"
                required={true}
                validator={validateUsername}
              />
              <button
                type="button"
                className="button cta-button centered secondary"
                onClick={handleSaveUsername}
              >
                {usernameFormStatus === FormStatus.Submitting
                  ? "Saving..."
                  : "Save Username"}
              </button>
            </fieldset>
            <span className={inputStyles.Label}>Teams:</span>
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
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}
