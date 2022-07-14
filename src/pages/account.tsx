import clsx from "clsx";
import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

// hooks
import useUser from "../hooks/UserContext";

// components
import { Input } from "../components/Input";
import ProtectedPage from "../components/ProtectedPage";

// styles
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
  const { currentUser, reFetchUser } = useUser();

  // state
  const [state, setState] = useState<Record<string, string>>(initialState);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);

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

  const handleSaveWardenInfo = async () => {
    if (!user) {
      return;
    }

    if (!state.discordUsername || !state.emailAddress) {
      return;
    }

    const discordValidationErrors = validateDiscordUsername(
      state.discordUsername
    );
    if (discordValidationErrors.length > 0) {
      return;
    }

    setStatus(FormStatus.Submitting);
    user.set("discordUsername", state.discordUsername);
    user.set("emailAddress", state.emailAddress);
    if (state.gitHubUsername) {
      user.set("gitHubUsername", state.gitHubUsername);
    }

    try {
      await user.save();
      await reFetchUser();
      toast.success("Your information has been updated");
      setStatus(FormStatus.Submitted);
    } catch (error) {
      setStatus(FormStatus.Error);
      toast.error("An error occurred. Your changes have not been saved");
    }
  };

  const resetWardenInfo = (): void => {
    getUser();
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
              label="Discord Username"
              handleChange={handleChange}
              value={state.discordUsername}
              name="discordUsername"
              required={true}
              validator={validateDiscordUsername}
            />
            <Input
              label="Email Address"
              handleChange={handleChange}
              value={state.emailAddress}
              name="emailAddress"
              required={true}
            />
            <Input
              label="Github Username (Optional)"
              handleChange={handleChange}
              value={state.gitHubUsername}
              name="gitHubUsername"
            />
            <div className={styles.ButtonsWrapper}>
              <button
                type="button"
                className="button cta-button secondary"
                onClick={resetWardenInfo}
                disabled={status === FormStatus.Submitting}
              >
                Clear Changes
              </button>
              <button
                type="button"
                className="button cta-button"
                onClick={handleSaveWardenInfo}
                disabled={status === FormStatus.Submitting}
              >
                {status === FormStatus.Submitting
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
          </form>
        </div>
      )}
    </ProtectedPage>
  );
}
