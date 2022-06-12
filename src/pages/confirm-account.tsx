import clsx from "clsx";
import { navigate } from "gatsby";
import React, { MouseEvent, useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";

import * as styles from "../components/form/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
  Loading = "loading",
}

export default function ConfirmAccount() {
  // hooks
  const { isAuthenticated, user, isInitialized, isInitializing } = useMoralis();
  const { logUserOut } = useUser();

  // state
  const [handles, setHandles] = useState<string[]>([]);
  const [confirmedHandle, setConfirmedHandle] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState<string>("");
  const [gitHubUsername, setGitHubUsername] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [hasValidationErrors, setHasValidationErrors] = useState<boolean>(
    false
  );
  const [isValidDiscord, setIsValidDiscord] = useState(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Loading);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // global variables
  const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const getUser = async (): Promise<void> => {
      if (!isAuthenticated || !user) {
        navigate("/");
        return;
      }

      const handlesPendingConfirmation = await user.get(
        "handlesPendingConfirmation"
      );
      if (
        !handlesPendingConfirmation ||
        handlesPendingConfirmation.length < 1
      ) {
        navigate("/");
        return;
      }

      setHandles(handlesPendingConfirmation);
      setConfirmedHandle(handlesPendingConfirmation[0]);
      setStatus(FormStatus.Unsubmitted);
    };
    getUser();
  }, [isAuthenticated, user, isInitialized]);

  const handleDiscordUsernameChange = (e) => {
    setDiscordUsername(e.target.value);
    setIsValidDiscord(discordUsernameRegex.test(e.target.value));
  };

  const handleSubmit = useCallback(
    async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();
      const url = `/.netlify/functions/register-warden`;
      if (
        !discordUsername ||
        !isValidDiscord ||
        !gitHubUsername ||
        !emailAddress
      ) {
        setHasValidationErrors(true);
        return;
      }
      setStatus(FormStatus.Submitting);
      const requestBody = {
        handle: confirmedHandle,
        moralisId: user.id,
        gitHubUsername,
        emailAddress,
        isUpdate: true,
        polygonAddress: user.attributes.ethAddress,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        try {
          user.set("c4Username", confirmedHandle);
          user.set("discordUsername", discordUsername);
          user.set("gitHubUsername", gitHubUsername);
          user.set("emailAddress", emailAddress);
          user.set("handlesPendingConfirmation", []);
          await user.save();
          logUserOut();
          setStatus(FormStatus.Submitted);
        } catch (error) {
          logUserOut();
          setStatus(FormStatus.Error);
          setErrorMessage(error.message || "");
        }
      } else {
        setStatus(FormStatus.Error);
        try {
          const res = await response.json();
          setErrorMessage(res.error || "");
        } catch (error) {
          setErrorMessage("");
        }
      }
    },
    [user, discordUsername, gitHubUsername, emailAddress, confirmedHandle]
  );

  const resetForm = () => {
    setErrorMessage("");
    setStatus(FormStatus.Unsubmitted);
  };

  return (
    <DefaultLayout>
      {status === FormStatus.Loading || isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="wrapper-main">
          <h1 className="page-header">
            {handles.length === 1
              ? `Welcome back, ${handles[0]}!`
              : "Welcome back!"}
          </h1>
          {(status === FormStatus.Unsubmitted ||
            status === FormStatus.Submitting) && (
            <form className={clsx(styles.Form)}>
              <p>
                Please confirm your identity and fill out the information below
              </p>
              {handles.length > 1 && (
                <>
                  <fieldset
                    className={clsx(
                      widgetStyles.Fields,
                      widgetStyles.RadioGroup
                    )}
                  >
                    {handles.map((handle) => (
                      <label className={widgetStyles.RadioLabel} key={handle}>
                        <input
                          className={widgetStyles.Radio}
                          type="radio"
                          value={handle}
                          name="handle"
                          checked={handle === confirmedHandle}
                          onChange={(e) => setConfirmedHandle(e.target.value)}
                        />
                        {handle}
                      </label>
                    ))}
                  </fieldset>
                </>
              )}
              <div className={widgetStyles.Container}>
                <label htmlFor="discordUsername" className={widgetStyles.Label}>
                  Discord Username *
                </label>
                <p className={widgetStyles.Help}>
                  Used in case we need to contact you about your submissions or
                  winnings.
                </p>
                <input
                  className={clsx(
                    widgetStyles.Control,
                    widgetStyles.Text,
                    hasValidationErrors &&
                      (!discordUsername || !isValidDiscord) &&
                      "input-error"
                  )}
                  type="text"
                  id="discordUsername"
                  name="discordUsername"
                  placeholder="Warden#1234"
                  value={discordUsername}
                  onChange={handleDiscordUsernameChange}
                />
                {!discordUsername && hasValidationErrors && (
                  <p className={widgetStyles.ErrorMessage}>
                    <small>This field is required</small>
                  </p>
                )}
                {hasValidationErrors && !isValidDiscord && (
                  <p className={widgetStyles.ErrorMessage}>
                    <small>
                      Make sure you enter your discord username, and not your
                      server nickname. It should end with '#' followed by 4
                      digits.
                    </small>
                  </p>
                )}
              </div>
              <div className={widgetStyles.Container}>
                <label htmlFor="gitHubUsername" className={widgetStyles.Label}>
                  GitHub Username *
                </label>
                <p className={widgetStyles.Help}>
                  Used in case we need to give you access to certain
                  repositories.
                </p>
                <input
                  className={clsx(
                    widgetStyles.Control,
                    widgetStyles.Text,
                    hasValidationErrors && !gitHubUsername && "input-error"
                  )}
                  type="text"
                  id="gitHubUsername"
                  name="gitHubUsername"
                  placeholder="Username"
                  value={gitHubUsername}
                  onChange={(e) => setGitHubUsername(e.target.value)}
                />
                {!gitHubUsername && hasValidationErrors && (
                  <p className={widgetStyles.ErrorMessage}>
                    <small>This field is required</small>
                  </p>
                )}
              </div>
              <div className={widgetStyles.Container}>
                <label htmlFor="emailAddress" className={widgetStyles.Label}>
                  Email Address *
                </label>
                <p className={widgetStyles.Help}>
                  Used for sending confirmation emails for each of your
                  submissions.
                </p>
                <input
                  className={clsx(
                    widgetStyles.Control,
                    widgetStyles.Text,
                    hasValidationErrors && !emailAddress && "input-error"
                  )}
                  type="text"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="warden@email.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                {!emailAddress && hasValidationErrors && (
                  <p className={widgetStyles.ErrorMessage}>
                    <small>This field is required</small>
                  </p>
                )}
              </div>
              <button
                className={clsx("button cta-button centered", styles.Button)}
                type="submit"
                onClick={handleSubmit}
              >
                {status === FormStatus.Submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
          {status === FormStatus.Error && (
            <div style={{ textAlign: "center" }}>
              <h1>Whoops!</h1>
              <p>An error occurred while confirming your account.</p>
              {errorMessage !== "" && (
                <p>
                  <small>{errorMessage}</small>
                </p>
              )}
              <button className="button cta-button" onClick={resetForm}>
                Try again
              </button>
            </div>
          )}
          {status === FormStatus.Submitted && (
            <div className="centered-text">
              <h1>Thank you!</h1>
              <p>
                Your wallet has successfully been connected to your account.
              </p>
              <p>
                You should receive an email confirmation with a link to the pull
                request to update your warden file. When the pull request has
                been merged, that means your re-registration has been fully
                processed and you can login to submit findings again within a
                few minutes.
              </p>
              <p>See you in the arena! 🐺</p>
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
}
