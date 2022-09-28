import clsx from "clsx";
import Moralis from "moralis-v1";
import { Moralis as MoralisTypes } from "moralis-v1/types";
import React, { useCallback, useState, useRef, ReactNode } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// hooks
import useUser from "../hooks/UserContext";

// components
import Agreement from "./content/Agreement";
import { Input } from "./Input";

// styles
import * as styles from "./form/Form.module.scss";
import * as widgetStyles from "./reporter/widgets/Widgets.module.scss";

interface userState {
  username: string;
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  password: string;
  useCustomPaymentAddress: boolean;
  polygonAddress: string;
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
  password: "",
  useCustomPaymentAddress: false,
  polygonAddress: "",
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

export default function RegistrationForm({ handles }) {
  // hooks
  const { logUserOut } = useUser();
  const { authenticate } = useMoralis();

  // state
  const [state, setState] = useState<userState>(initialState);
  const [isValidDiscord, setIsValidDiscord] = useState<boolean>(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>("");
  const [isDangerousUsername, setIsDangerousUsername] = useState<boolean>(
    false
  );
  const [captchaToken, setCaptchaToken] = useState<string>("");

  // global variables
  const avatarInputRef = useRef<HTMLInputElement>();
  const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");

  const updateErrorMessage = (message: string | undefined): void => {
    if (!message) {
      setErrorMessage("");
    } else if (message === "Reference already exists") {
      setErrorMessage(
        <span>
          It looks like this username has already been registered. Don't forget
          to join us in{" "}
          <a
            href="https://discord.gg/code4rena"
            target="_blank"
            rel="noreferrer"
          >
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
      setIsDangerousUsername(value.match(/^[0-9a-zA-Z_\-]+$/) === null);
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

  const toggleUseCustomPaymentAddress = () => {
    setState((prevState) => {
      return {
        ...prevState,
        useCustomPaymentAddress: !prevState.useCustomPaymentAddress,
      };
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
    (provider: MoralisTypes.Web3ProviderType = "metamask") => {
      const url = `/.netlify/functions/register-warden`;
      (async () => {
        if (
          !captchaToken ||
          !state.username ||
          !state.discordUsername ||
          !isValidDiscord ||
          !state.emailAddress ||
          !state.password ||
          state.password.length < 18 ||
          isDangerousUsername ||
          handles.has(state.username)
        ) {
          return;
        }

        setStatus(FormStatus.Submitting);

        let image: unknown = undefined;
        try {
          if (state.avatar) {
            image = await getFileAsBase64(state.avatar);
          }
          const user = await authenticate({
            provider,
            signingMessage: "Code4rena registration",
          });

          if (user === undefined) {
            // user clicked "cancel" when prompted to sign message (or some unknown error occurred)
            // @todo: update messaging
            setStatus(FormStatus.Error);
            updateErrorMessage("You must sign the message to register");
            return;
          }

          const moralisId = user.id;
          const polygonAddress = user.get("ethAddress");
          const username = await user.get("username");
          const isRegistrationComplete = await user.get("registrationComplete");
          if (isRegistrationComplete) {
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
            link: state.link,
            image,
          } as {
            handle: string;
            gitHubUsername: string;
            emailAddress: string;
            moralisId: string;
            link?: string;
            image?: unknown;
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
              user.set("username", state.username);
              user.set("password", state.password);
              user.set("discordUsername", state.discordUsername);
              if (state.gitHubUsername) {
                user.set("gitHubUsername", state.gitHubUsername);
              }
              user.set("email", state.emailAddress);
              user.set("registrationComplete", true);
              await user.save();
              await Moralis.Cloud.run("addPaymentAddress", {
                address: polygonAddress,
                chain: "polygon",
              });
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
              if (!user.attributes.uuid) {
                user.set("uuid", user.attributes.username);
              }
              user.set("username", state.username);
              user.set("password", state.password);
              user.set("discordUsername", state.discordUsername);
              if (state.gitHubUsername) {
                user.set("gitHubUsername", state.gitHubUsername);
              }
              user.set("registrationComplete", true);
              // @todo: add role
              await user.save();
              setStatus(FormStatus.Submitted);
              toast.error(
                "The email you entered was invalid. Confirmation email failed to send and email address has not been saved."
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
      handles,
      isDangerousUsername,
      isValidDiscord,
      captchaToken,
    ]
  );

  const usernameValidator = useCallback(
    (value: string) => {
      const validationErrors: (string | React.ReactNode)[] = [];
      if (handles.has(value)) {
        validationErrors.push(`${value} is already a registered username.`);
      }
      if (isDangerousUsername) {
        validationErrors.push(
          "Supports alphanumeric characters, underscores, and hyphens."
        );
      }
      return validationErrors;
    },
    [isDangerousUsername, handles]
  );

  const discordUsernameValidator = useCallback(
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

  const passwordValidator = (value: string) => {
    const validationErrors: (string | React.ReactNode)[] = [];
    if (value.length < 18) {
      validationErrors.push("Password should be at least 18 characters long.");
    }
    return validationErrors;
  };

  const customPaymentAddressValidator = (value): (string | ReactNode)[] => {
    const errors: string[] = [];
    if (value.length > 0 && value.length !== 42) {
      errors.push("Address must be 42 characters long");
    }
    return errors;
  };

  return (
    <form className={styles.EmphasizedInputGroup}>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <>
          <p>
            To register as a warden, please fill out this form and join us in{" "}
            <a
              href="https://discord.gg/code4rena"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>
          </p>
          <Input
            label="Code4rena Username"
            required={true}
            helpText={
              <>
                <strong className={styles.Heading4}>
                  Choose wisely! Your username cannot be changed later.
                </strong>
                <br />
                Used to report findings, as well as display your total award
                amount on the leaderboard. Supports alphanumeric characters,
                underscores, and hyphens.
                <br />
                (Note: for consistency, please ensure your server nickname in
                our Discord matches the username you provide here)
              </>
            }
            name="username"
            placeholder="Username"
            value={state.username}
            handleChange={handleChange}
            maxLength={25}
            validator={usernameValidator}
          />
          <Input
            label="Discord Username"
            required={true}
            name="discordUsername"
            helpText="Used in case we need to contact you about your submissions or winnings."
            placeholder="Warden#1234"
            value={state.discordUsername}
            handleChange={handleChange}
            validator={discordUsernameValidator}
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
            validator={passwordValidator}
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
          <Input
            label="Link"
            required={false}
            helpText="Link your leaderboard entry to a personal website or social media account."
            name="link"
            placeholder="https://twitter.com/code4rena"
            value={state.link || ""}
            handleChange={handleChange}
          />
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
              // @ts-ignore // @todo: fix typescript error
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
          <div className={widgetStyles.Container}>
            <label
              htmlFor="useCustomPaymentAddress"
              className={widgetStyles.RadioLabel}
            >
              <input
                className={widgetStyles.Checkbox}
                type="checkbox"
                id="useCustomPaymentAddress"
                name="useCustomPaymentAddress"
                checked={!state.useCustomPaymentAddress}
                onChange={toggleUseCustomPaymentAddress}
              />
              Use my wallet address for payment on Polygon
            </label>
          </div>
          {state.useCustomPaymentAddress && (
            <Input
              label="Polygon Address"
              required={true}
              handleChange={handleChange}
              value={state.polygonAddress}
              name="polygonAddress"
              validator={customPaymentAddressValidator}
            />
          )}
          <div className="captcha-container">
            <HCaptcha
              sitekey={process.env.GATSBY_HCAPTCHA_SITE_KEY!}
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
                <button
                  className={clsx("button cta-button", styles.Button)}
                  type="button"
                  disabled={true}
                  onClick={() => submitRegistration("walletConnect")}
                >
                  Register without a wallet
                </button>
              </>
            )}
          </div>
        </>
      )}
      {status === FormStatus.Error && (
        <>
          <h2>Whoops!</h2>
          <p>An error occurred while processing your registration.</p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
          <button className="button cta-button" onClick={resetForm}>
            Try again
          </button>
        </>
      )}
      {status === FormStatus.Submitted && (
        <>
          <h2>Thank you!</h2>
          <p>Your registration has been submitted.</p>
          <h2>A few more things...</h2>
          <ol>
            <li>
              Join us in <a href="https://discord.gg/code4rena">Discord</a> if
              you haven't already.
            </li>
            <li>
              Make sure that your server nickname in Discord matches the
              username you just registered with.
            </li>
            <li>Give us a howl in #i-want-to-be-a-warden!</li>
          </ol>
          <p>We look forward to seeing you in the arena!</p>
        </>
      )}
    </form>
  );
}
