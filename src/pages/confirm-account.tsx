import clsx from "clsx";
import { navigate } from "gatsby";
import React, { MouseEvent, useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// hooks
import useUser from "../hooks/UserContext";

// components
import DefaultLayout from "../templates/DefaultLayout";
import { Input } from "../components/Input";

// styles
import * as styles from "../components/form/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
  Loading = "loading",
}

interface userState {
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  password: string;
}

const initialState: userState = {
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  password: "",
};

export default function ConfirmAccount() {
  // hooks
  const { isAuthenticated, user, isInitialized, isInitializing } = useMoralis();
  const { logUserOut } = useUser();

  // state
  const [handles, setHandles] = useState<string[]>([]);
  const [confirmedHandle, setConfirmedHandle] = useState<string>("");
  const [state, setState] = useState<userState>(initialState);
  const [isValidDiscord, setIsValidDiscord] = useState(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Loading);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState("");

  // global variables
  const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");

  useEffect(() => {
    // when page first loads, redirect to home page if user is not logged in.
    if (!isInitialized) {
      return;
    }
    if (!isAuthenticated || !user) {
      navigate("/");
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const getUser = async (): Promise<void> => {
      if (!isAuthenticated || !user) {
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
    if (name === "discordUsername") {
      setIsValidDiscord(!value.match(/.*#[0-9]{4}/));
    }
  }, []);

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const handleSubmit = useCallback(
    async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();
      if (!user) {
        return;
      }
      const url = `/.netlify/functions/register-warden`;
      if (
        !user ||
        !captchaToken ||
        !state.discordUsername ||
        !isValidDiscord ||
        !state.emailAddress ||
        !state.password ||
        state.password.length < 18 ||
        !confirmedHandle
      ) {
        return;
      }
      setStatus(FormStatus.Submitting);
      const requestBody = {
        handle: confirmedHandle,
        moralisId: user.id,
        gitHubUsername: state.gitHubUsername,
        emailAddress: state.emailAddress,
        isUpdate: true,
        polygonAddress: user.attributes.ethAddress,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: captchaToken,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        try {
          if (!user.attributes.uuid) {
            user.set("uuid", user.attributes.username);
          }
          user.set("username", confirmedHandle);
          user.set("discordUsername", state.discordUsername);
          user.set("email", state.emailAddress);
          user.set("password", state.password);
          user.set("registrationComplete", true);
          user.set("handlesPendingConfirmation", []);
          if (state.gitHubUsername) {
            user.set("gitHubUsername", state.gitHubUsername);
          }
          await user.save();
          logUserOut();
          setStatus(FormStatus.Submitted);
        } catch (error) {
          logUserOut();
          setStatus(FormStatus.Error);
          if (error.message === "Reference already exists") {
            setErrorMessage(
              "It looks like your account confirmation is already pending. Check your email for a link to the PR in GitHub."
            );
          } else {
            setErrorMessage(error.message || "");
          }
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
    [captchaToken, user, state, confirmedHandle]
  );

  const resetForm = () => {
    setErrorMessage("");
    setStatus(FormStatus.Unsubmitted);
  };

  const validatePassword = (value: string) => {
    const validationErrors: (string | React.ReactNode)[] = [];
    if (value.length < 18) {
      validationErrors.push("Password should be at least 18 characters long.");
    }
    return validationErrors;
  };

  const validateDiscordUsername = useCallback(
    (value: string) => {
      const validationErrors: (string | React.ReactNode)[] = [];
      if (!isValidDiscord) {
        validationErrors.push(
          "Make sure you enter your discord username, and not your server nickname. It should end with '#' followed by 4 digits."
        );
      }
      return validationErrors;
    },
    [isValidDiscord]
  );

  return (
    <DefaultLayout hideConnectWalletDropdown={true}>
      {status === FormStatus.Loading || isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="wrapper-main">
          <h1 className="page-header">
            {handles.length === 1
              ? `Welcome back, ${confirmedHandle}!`
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
              <p>Polygon Address: {user!.attributes.ethAddress}</p>
              <Input
                label="Discord Username"
                required={true}
                helpText="Used in case we need to contact you about your submissions or winnings."
                name="discordUsername"
                placeholder="Warden#1234"
                value={state.discordUsername}
                handleChange={handleChange}
                validator={validateDiscordUsername}
              />
              <Input
                label="Email Address"
                required={true}
                helpText="Used for sending confirmation emails for each of your submissions."
                name="emailAddress"
                placeholder="warden@email.com"
                value={state.emailAddress}
                handleChange={handleChange}
              />
              <Input
                label="Password"
                required={true}
                name="password"
                placeholder="Password"
                type="password"
                value={state.password}
                handleChange={handleChange}
                validator={validatePassword}
              />
              <Input
                label="GitHub Username"
                required={false}
                helpText="Used in case we need to give you access to certain repositories."
                name="gitHubUsername"
                placeholder="Username"
                value={state.gitHubUsername}
                handleChange={handleChange}
              />
              <div className="captcha-container">
                <HCaptcha
                  sitekey={process.env.GATSBY_HCAPTCHA_SITE_KEY!}
                  theme="dark"
                  onVerify={handleCaptchaVerification}
                />
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
