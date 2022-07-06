import React, {
  useCallback,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import clsx from "clsx";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Moralis from "moralis/types";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import Agreement from "./content/Agreement";
import WardenField from "../components/reporter/widgets/WardenField";

import * as styles from "../components/form/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

interface userState {
  username: string;
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  link?: string;
  avatar?: File | null;
}

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
}

const initialState: userState = {
  username: "",
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  link: "",
  avatar: null,
};

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

export default function RegistrationForm({ handles, wardens, className }) {
  // hooks
  const { logUserOut } = useUser();
  const { authenticate } = useMoralis();

  // state
  const [state, setState] = useState(initialState);
  const [isNewUser, setIsNewUser] = useState(true);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [isValidDiscord, setIsValidDiscord] = useState(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>("");
  const [isDangerousUsername, setisDangerousUsername] = useState(false);
  const [hasValidateLinkError, setHasValidateLinkError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  // global variables
  const avatarInputRef = useRef<HTMLInputElement>();
  const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");
  const checkAbsoluteURL = new RegExp("^(?:[a-z]+:)?//", "i");
  const instructions = isNewUser ? (
    <p>
      To register as a warden, please fill out this form and join us in{" "}
      <a href="https://discord.gg/code4rena" target="_blank">
        Discord
      </a>
    </p>
  ) : (
    <p>
      If you are an established code4rena Warden, create an account to login
      with your wallet.
    </p>
  );

  const updateErrorMessage = (message: string | undefined): void => {
    if (!message) {
      setErrorMessage("");
    } else if (message === "Reference already exists") {
      setErrorMessage(
        <span>
          It looks like this username has already been registered. Don't forget
          to join us in{" "}
          <a href="https://discord.gg/code4rena" target="_blank">
            Discord
          </a>{" "}
          and give us a howl in #i-want-to-be-a-warden"
        </span>
      );
    } else {
      setErrorMessage(message);
    }
  };

  const resetForm = () => {
    setErrorMessage("");
    setStatus(FormStatus.Unsubmitted);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
    if (name === "discordUsername") {
      setIsValidDiscord(discordUsernameRegex.test(value));
    }
    if (name === "username") {
      setisDangerousUsername(value.match(/^[0-9a-zA-Z_\-]+$/) === null);
    }
    if (name === "link") {
      if (value !== undefined && value !== "") {
        setHasValidateLinkError(!checkAbsoluteURL.test(value));
      }
    }
  }, []);

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

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

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
    (provider: Moralis.Web3ProviderType = "metamask") => {
      const url = `/.netlify/functions/register-warden`;
      (async () => {
        if (
          !captchaToken ||
          !state.username ||
          !state.discordUsername ||
          !isValidDiscord ||
          !state.emailAddress ||
          isDangerousUsername ||
          (isNewUser && handles.has(state.username)) ||
          hasValidateLinkError
        ) {
          setHasValidationErrors(true);
          return;
        }

        setHasValidationErrors(false);
        setStatus(FormStatus.Submitting);

        let image = undefined;
        try {
          if (state.avatar) {
            image = await getFileAsBase64(state.avatar);
          }
          const user = await authenticate({
            provider,
            signingMessage: "Code4rena registration",
          });

          if (user === undefined) {
            // user clicked "cancel" when prompted to sign message
            // @todo: update messaging
            setStatus(FormStatus.Error);
            updateErrorMessage("You must sign the message to register");
            return;
          }

          const moralisId = user.id;
          const polygonAddress = user.get("ethAddress");
          const username = await user.get("c4Username");
          if (username) {
            await logUserOut();
            setStatus(FormStatus.Error);
            if (username !== state.username) {
              // user tried to register more than one account with this address
              updateErrorMessage(
                `This address is already registered with the username "${username}"`
              );
            } else {
              // registration is pending
              updateErrorMessage("Reference already exists");
            }
            return;
          }

          const requestBody = {
            handle: state.username,
            gitHubUsername: state.gitHubUsername,
            emailAddress: state.emailAddress,
            polygonAddress,
            moralisId,
          } as {
            handle: string;
            gitHubUsername: string;
            emailAddress: string;
            moralisId: string;
            link?: string;
            image?: unknown;
            isUpdate?: boolean;
          };

          if (isNewUser) {
            requestBody.link = state.link;
            requestBody.image = image;
          } else {
            requestBody.isUpdate = true;
          }

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
              user.set("c4Username", state.username);
              user.set("discordUsername", state.discordUsername);
              if (state.gitHubUsername) {
                user.set("gitHubUsername", state.gitHubUsername);
              }
              user.set("emailAddress", state.emailAddress);
              // @todo: add role
              await user.save();
              setStatus(FormStatus.Submitted);
            } catch (error) {
              setStatus(FormStatus.Error);
              updateErrorMessage("");
              console.error(error);
            }
            setStatus(FormStatus.Submitted);
          } else {
            const { error } = await response.json();
            if (error.startsWith("Failed to send confirmation email")) {
              // allow confirmation email to fail; don't save a bad email address
              user.set("c4Username", state.username);
              user.set("discordUsername", state.discordUsername);
              if (state.gitHubUsername) {
                user.set("gitHubUsername", state.gitHubUsername);
              }
              // @todo: add role
              await user.save();
              setStatus(FormStatus.Submitted);
              toast.error(
                "The email you entered was invalid. Confirmation email failed to send and email address has not been saved"
              );
            } else {
              setStatus(FormStatus.Error);
              updateErrorMessage(error);
            }
          }
          logUserOut();
        } catch (error) {
          logUserOut();
          setStatus(FormStatus.Error);
          updateErrorMessage(error);
        }
      })();
    },
    [
      avatarInputRef,
      state,
      isNewUser,
      handles,
      hasValidationErrors,
      isValidDiscord,
      captchaToken,
      hasValidateLinkError,
    ]
  );

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsNewUser(event.target.value === "newUser");
    setState((prevState) => {
      return { ...prevState, username: "" };
    });
  };

  return (
    <>
      {status === FormStatus.Unsubmitted || status === FormStatus.Submitting ? (
        <form className={className}>
          <fieldset
            className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}
          >
            <label className={widgetStyles.RadioLabel}>
              <input
                className={widgetStyles.Radio}
                type="radio"
                value="newUser"
                name="isNewUser"
                checked={isNewUser}
                onChange={handleFormChange}
              />
              I'm new here
            </label>
            <label className={widgetStyles.RadioLabel}>
              <input
                className={widgetStyles.Radio}
                type="radio"
                value="establishedUser"
                name="isNewUser"
                checked={!isNewUser}
                onChange={handleFormChange}
              />
              I'm a registered warden
            </label>
          </fieldset>
          {instructions}
          {isNewUser ? (
            <div className={widgetStyles.Container}>
              <label htmlFor="username" className={widgetStyles.Label}>
                Code4rena Username *
              </label>
              <p className={widgetStyles.Help}>
                Used to report findings, as well as display your total award
                amount on the leaderboard. Supports alphanumeric characters,
                underscores, and hyphens. (Note: for consistency, please ensure
                your server nickname in our Discord matches the username you
                provide here)
              </p>
              <input
                className={clsx(
                  widgetStyles.Control,
                  widgetStyles.Text,
                  hasValidationErrors &&
                    (!state.username ||
                      isDangerousUsername ||
                      (isNewUser && handles.has(state.username))) &&
                    "input-error"
                )}
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={state.username}
                onChange={handleChange}
                maxLength={25}
              />
              {handles.has(state.username) && (
                <p className={widgetStyles.ErrorMessage}>
                  <small>{`${state.username} is already a registered username.`}</small>
                </p>
              )}
              {hasValidationErrors && !state.username && (
                <p className={widgetStyles.ErrorMessage}>
                  <small>This field is required</small>
                </p>
              )}
              {hasValidationErrors && isDangerousUsername && (
                <p className={widgetStyles.ErrorMessage}>
                  <small>
                    Supports alphanumeric characters, underscores, and hyphens
                  </small>
                </p>
              )}
            </div>
          ) : (
            <div className={widgetStyles.Container}>
              <label className={widgetStyles.Label}>Code4rena Username *</label>
              <p className={widgetStyles.Help}>
                The username you use to submit your findings
              </p>
              <WardenField
                name="handle"
                required={true}
                options={wardens}
                onChange={(e) => {
                  setState((state) => {
                    return { ...state, username: e.target.value };
                  });
                }}
                fieldState={state}
                isInvalid={hasValidationErrors && !state.username}
              />
              {hasValidationErrors && !state.username && (
                <p className={widgetStyles.ErrorMessage}>
                  <small>This field is required</small>
                </p>
              )}
            </div>
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
                  (!state.discordUsername || !isValidDiscord) &&
                  "input-error"
              )}
              type="text"
              id="discordUsername"
              name="discordUsername"
              placeholder="Warden#1234"
              value={state.discordUsername}
              onChange={handleChange}
            />
            {hasValidationErrors && !state.discordUsername && (
              <p className={widgetStyles.ErrorMessage}>
                <small>This field is required</small>
              </p>
            )}
            {hasValidationErrors && !isValidDiscord && (
              <p className={widgetStyles.ErrorMessage}>
                <small>
                  Make sure you enter your discord username, and not your server
                  nickname. It should end with '#' followed by 4 digits.
                </small>
              </p>
            )}
          </div>
          <div className={widgetStyles.Container}>
            <label htmlFor="emailAddress" className={widgetStyles.Label}>
              Email Address *
            </label>
            <p className={widgetStyles.Help}>
              Used for sending confirmation emails for each of your submissions.
            </p>
            <input
              className={clsx(
                widgetStyles.Control,
                widgetStyles.Text,
                hasValidationErrors && !state.emailAddress && "input-error"
              )}
              type="text"
              id="emailAddress"
              name="emailAddress"
              placeholder="warden@email.com"
              value={state.emailAddress}
              onChange={handleChange}
            />
            {hasValidationErrors && !state.emailAddress && (
              <p className={widgetStyles.ErrorMessage}>
                <small>This field is required</small>
              </p>
            )}
          </div>
          <div className={widgetStyles.Container}>
            <label htmlFor="gitHubUsername" className={widgetStyles.Label}>
              GitHub Username (Optional)
            </label>
            <p className={widgetStyles.Help}>
              Used in case we need to give you access to certain repositories.
            </p>
            <input
              className={clsx(widgetStyles.Control, widgetStyles.Text)}
              type="text"
              id="gitHubUsername"
              name="gitHubUsername"
              placeholder="Username"
              value={state.gitHubUsername}
              onChange={handleChange}
            />
          </div>
          {isNewUser && (
            <>
              <div className={widgetStyles.Container}>
                <label htmlFor="link" className={widgetStyles.Label}>
                  Link (Optional)
                </label>
                <p className={widgetStyles.Help}>
                  Link your leaderboard entry to a personal website or social
                  media account.
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
                {hasValidationErrors && hasValidateLinkError && (
                  <p className={widgetStyles.ErrorMessage}>
                    Please provide a valid url. "https://domain_name" required.
                  </p>
                )}
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
          <div className="captcha-container">
            <HCaptcha
              sitekey="4963abcb-188b-4972-8e44-2887e315af52"
              theme="dark"
              onVerify={handleCaptchaVerification}
            />
          </div>
          <Agreement />
          <div className={styles.ButtonsWrapper}>
            {status === FormStatus.Submitting ? (
              <span className={clsx("button cta-button", styles.Button)}>
                Submitting...
              </span>
            ) : (
              <>
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
              </>
            )}
          </div>
        </form>
      ) : status === FormStatus.Error ? (
        <div className="centered-text">
          <h1>Whoops!</h1>
          <p>An error occurred while processing your registration.</p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
          <button className="button cta-button" onClick={resetForm}>
            Try again
          </button>
        </div>
      ) : isNewUser ? (
        <div className="centered-text">
          <h1>Thank you!</h1>
          <p>Your registration has been submitted.</p>
          <h2>One more thing...</h2>
          <p>
            Before we can complete your registration, please join us in{" "}
            <a href="https://discord.gg/code4rena">Discord</a> and give us a
            howl in #i-want-to-be-a-warden! <br />
            We look forward to seeing you in the arena!
          </p>
        </div>
      ) : (
        <div className="centered-text">
          <h1>Thank you!</h1>
          <p>Your wallet has successfully been connected to your account.</p>
          <p>
            You should receive an email confirmation with a link to the pull
            request to update your warden file. You will also be tagged in the
            pull request, so you will know when your request has been fully
            processed and you can begin to submit findings again.
          </p>
          <p>See you in the arena! 🐺</p>
        </div>
      )}
    </>
  );
}
