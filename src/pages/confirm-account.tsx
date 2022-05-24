import clsx from "clsx";
import Moralis from "moralis";
import { navigate } from "gatsby";
import React, { MouseEvent, useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";

import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
  Loading = "loading",
}

export default function ConfirmAccount() {
  const { isAuthenticated, user } = useMoralis();
  const { logUserOut } = useUser();
  const [handles, setHandles] = useState<string[]>([]);
  const [confirmedHandle, setConfirmedHandle] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState<string>("");
  const [gitHubUsername, setGitHubUsername] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [hasValidationErrors, setHasValidationErrors] = useState<boolean>(
    false
  );
  const [status, setStatus] = useState<FormStatus>(FormStatus.Loading);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
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
  }, [isAuthenticated, user]);

  const handleSubmit = useCallback(
    async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();
      const url = `/.netlify/functions/register-warden`;
      if (!discordUsername || !gitHubUsername || !emailAddress) {
        setHasValidationErrors(true);
        return;
      }
      setStatus(FormStatus.Submitting);
      const requestBody = {
        handle: confirmedHandle,
        moralisId: user.id,
        isUpdate: true,
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
          console.log(user);
          user.set("c4Username", confirmedHandle);
          user.set("discordUsername", discordUsername);
          user.set("gitHubUsername", gitHubUsername);
          user.set("emailAddress", emailAddress);
          user.set("handlesPendingConfirmation", []);
          // @todo: add role
          await user.save();
          await Moralis.Cloud.run("markUserConfirmed", {
            handle: confirmedHandle,
          });
          logUserOut();
          setStatus(FormStatus.Submitted);
        } catch (error) {
          logUserOut();
          setStatus(FormStatus.Error);
          setErrorMessage(error.message || "");
          console.error(error);
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

  return status === FormStatus.Loading ? (
    // @todo: style a loading state
    <div>LOADING...</div>
  ) : (
    <DefaultLayout>
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
                  className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}
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
                  hasValidationErrors && !discordUsername && "input-error"
                )}
                type="text"
                id="discordUsername"
                name="discordUsername"
                placeholder="Warden#1234"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
              />
              {!discordUsername && hasValidationErrors && (
                <p className={widgetStyles.ErrorMessage}>
                  <small>This field is required</small>
                </p>
              )}
              {/* @todo: validate discord username
            {isDiscordUsernameInvalid() && (
              <p className={widgetStyles.Help}>
                <small>
                  Make sure you enter your discord username, and not your server
                  nickname. It should end with '#' followed by 4 digits.
                </small>
              </p>
            )} */}
            </div>
            <div className={widgetStyles.Container}>
              <label htmlFor="gitHubUsername" className={widgetStyles.Label}>
                GitHub Username *
              </label>
              <p className={widgetStyles.Help}>
                Used in case we need to give you access to certain repositories.
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
              Submit
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
            {/* @todo: handle pending */}
          </div>
        )}
        {status === FormStatus.Submitted && (
          <div className="centered-text">
            <h1>Thank you!</h1>
            <p>Your wallet has successfully been connected to your account.</p>
            <h2>One more thing...</h2>
            <p>
              We need to manually approve your account. Please give us a howl{" "}
              <a href="https://discord.gg/code4rena">Discord</a> in the channel
              #i-want-to-be-a-warden.
            </p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
