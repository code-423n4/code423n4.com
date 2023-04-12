import clsx from "clsx";
import Moralis from "moralis-v1";
import { Moralis as MoralisTypes } from "moralis-v1/types";
import React, { useCallback, useState, useRef, ReactNode } from "react";
import { useMoralis } from "react-moralis";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// utils
import { generateId } from "../utils/uuid";

// hooks
import useUser from "../hooks/UserContext";

// components
import Agreement from "./content/Agreement";
import { Input } from "./Input";
import RegistrationFormCommonFields from "./RegistrationFormCommonFields";

interface userState {
  username: string;
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  useCustomPaymentAddress: boolean;
  polygonAddress: string;
  link?: string;
  avatar?: File | null;
}

enum FormStatus {
  Unsubmitted = "unsubmitted",
  SubmitAttempted = "submitAttempted",
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
  confirmPassword: "",
  useCustomPaymentAddress: false,
  polygonAddress: "",
  link: "",
  avatar: null,
};

enum RegistrationType {
  Wallet = "wallet",
  UsernameAndPassword = "usernameAndPassword",
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

export default function RegistrationForm({ handles }) {
  // hooks
  const { logUserOut } = useUser();
  const { authenticate, signup } = useMoralis();

  // state
  const [state, setState] = useState<userState>(initialState);
  const [isValidDiscord, setIsValidDiscord] = useState<boolean>(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>("");
  const [isDangerousUsername, setIsDangerousUsername] = useState<boolean>(
    false
  );
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    RegistrationType.Wallet
  );

  // global variables
  const avatarInputRef = useRef<HTMLInputElement>();
  const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");

  const updateErrorMessage = (
    message: string | React.ReactNode | undefined
  ): void => {
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    },
    []
  );

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

  const saveUserInfo = async (user, polygonAddress): Promise<void> => {
    const userId = generateId();
    try {
      user.set("uuid", userId);
      user.set("discordUsername", state.discordUsername);
      user.set("gitHubUsername", state.gitHubUsername || undefined);
      if (registrationType === RegistrationType.Wallet) {
        user.set("username", state.username);
        user.set("password", state.password);
        user.set("email", state.emailAddress);
      }
      await user.save();
    } catch (error) {
      throw error.message || `${error}`;
    }
    try {
      await Moralis.Cloud.run("addPaymentAddress", {
        address: polygonAddress,
        chain: "polygon",
      });
    } catch (error) {
      toast.error(
        <>
          There was a problem saving your Polygon address:{" "}
          <strong>error.message || error</strong>
          <br />
          Please update your payment information after your registration is
          complete
        </>
      );
    } finally {
      setStatus(FormStatus.Submitted);
    }
  };

  const submitRegistration = async (
    provider?: MoralisTypes.Web3ProviderType
  ) => {
    const url = `/.netlify/functions/register-warden`;
    setStatus(FormStatus.SubmitAttempted);
    if (
      !captchaToken ||
      !state.username ||
      !state.discordUsername ||
      !isValidDiscord ||
      !state.emailAddress ||
      !state.password ||
      state.password.length < 18 ||
      isDangerousUsername ||
      handles.has(state.username) ||
      (registrationType === RegistrationType.UsernameAndPassword &&
        !state.polygonAddress) ||
      (registrationType === RegistrationType.UsernameAndPassword &&
        state.polygonAddress.length !== 42) ||
      (registrationType === RegistrationType.Wallet &&
        state.useCustomPaymentAddress &&
        !state.polygonAddress) ||
      (registrationType === RegistrationType.Wallet &&
        state.useCustomPaymentAddress &&
        state.polygonAddress.length !== 42)
    ) {
      return;
    }
    setStatus(FormStatus.Submitting);

    let image: unknown = undefined;
    try {
      if (state.avatar) {
        image = await getFileAsBase64(state.avatar);
      }
      let user;
      if (!provider) {
        try {
          user = await signup(
            state.username,
            state.password,
            state.emailAddress
          );
        } catch (error) {
          throw error.message || `${error}`;
        }
      } else {
        user = await authenticate({
          provider,
          signingMessage: "Code4rena registration",
        });
      }

      if (user === undefined) {
        // user clicked "cancel" when prompted to sign message (or some unknown error occurred)
        // @todo: update messaging
        throw "You must sign the message to register";
      }

      const moralisId = user.id;
      const authAddress = (await user.get("ethAddress")) || null;
      const username = await user.get("username");
      const isRegistrationComplete = await user.get("registrationComplete");
      if (isRegistrationComplete) {
        if (username !== state.username) {
          // user tried to register more than one account with this address
          throw `This address is already registered with the username "${username}"`;
        } else {
          // registration is pending
          throw "Reference already exists";
        }
      }
      const paymentAddress =
        registrationType === RegistrationType.UsernameAndPassword ||
        state.useCustomPaymentAddress
          ? state.polygonAddress
          : authAddress;

      try {
        await saveUserInfo(user, paymentAddress);
      } catch (error) {
        throw error.message || `${error}`;
      }

      const requestBody = {
        handle: state.username,
        gitHubUsername: state.gitHubUsername,
        emailAddress: state.emailAddress,
        polygonAddress: paymentAddress,
        moralisId,
        link: state.link,
        image,
      } as {
        handle: string;
        gitHubUsername: string;
        emailAddress: string;
        polygonAddress: string;
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

      const res = await response.json();

      if (response.ok) {
        user.set("registrationComplete", true);
        await user.save();
      } else if (res.error.startsWith("Failed to send confirmation email")) {
        // allow confirmation email to fail; don't save a bad email address
        user.set("registrationComplete", true);
        await user.save();
        toast.error(
          <>
            The email you entered was invalid and has not been saved. Please
            save a valid email address once your registration is complete.
          </>
        );
      } else {
        throw res.error;
      }
      logUserOut();
    } catch (error) {
      logUserOut();
      setStatus(FormStatus.Error);
      updateErrorMessage(error);
    }
  };

  const usernameValidator = useCallback(
    (value: string) => {
      const validationErrors: (string | React.ReactNode)[] = [];
      const handleNames: string[] = Array.from(handles.values());
      const existingHandle = handleNames.find((handle) => {
        return handle.toLowerCase() === value.toLowerCase();
      });
      if (existingHandle) {
        validationErrors.push(
          `${value} is already registered as a team, bot, or warden.`
        );
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

  const confirmPasswordValidator = useCallback(
    (value: string) => {
      const validationErrors: (string | React.ReactNode)[] = [];
      if (value !== state.password) {
        validationErrors.push("Passwords do not match.");
      }
      return validationErrors;
    },
    [state.password]
  );

  const customPaymentAddressValidator = (value): (string | ReactNode)[] => {
    const errors: string[] = [];
    if (value.length > 0 && value.length !== 42) {
      errors.push("Address must be 42 characters long");
    }
    return errors;
  };

  return (
    <>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting ||
        status === FormStatus.SubmitAttempted) && (
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
          <form>
            <Tabs className="form-tab">
              <TabList className="secondary-nav">
                <Tab
                  onClick={() => setRegistrationType(RegistrationType.Wallet)}
                  className="secondary-nav__item"
                >
                  Register with Wallet
                </Tab>
                <Tab
                  onClick={() =>
                    setRegistrationType(RegistrationType.UsernameAndPassword)
                  }
                  className="secondary-nav__item"
                >
                  Register with Password
                </Tab>
              </TabList>

              <TabPanel>
                <RegistrationFormCommonFields
                  username={state.username}
                  discordUsername={state.discordUsername}
                  emailAddress={state.emailAddress}
                  password={state.password}
                  confirmPassword={state.confirmPassword}
                  gitHubUsername={state.gitHubUsername}
                  link={state.link}
                  avatar={state.avatar}
                  avatarInputRef={avatarInputRef}
                  handleChange={handleChange}
                  handleAvatarChange={handleAvatarChange}
                  removeAvatar={removeAvatar}
                  usernameValidator={usernameValidator}
                  discordUsernameValidator={discordUsernameValidator}
                  passwordValidator={passwordValidator}
                  confirmPasswordValidator={confirmPasswordValidator}
                  submitted={status === FormStatus.SubmitAttempted}
                />
                <fieldset>
                  <label
                    htmlFor="useCustomPaymentAddress"
                    className="Widget__RadioLabel"
                  >
                    <input
                      type="checkbox"
                      id="useCustomPaymentAddress"
                      name="useCustomPaymentAddress"
                      checked={!state.useCustomPaymentAddress}
                      onChange={toggleUseCustomPaymentAddress}
                    />
                    Use my wallet address for payment on Polygon
                    {state.useCustomPaymentAddress && (
                      <Input
                        label="Polygon Address"
                        helpText="Polygon address where we should send your awards"
                        required={true}
                        handleChange={handleChange}
                        value={state.polygonAddress}
                        name="polygonAddress"
                        validator={customPaymentAddressValidator}
                        forceValidation={status === FormStatus.SubmitAttempted}
                        maxLength={42}
                      />
                    )}
                  </label>
                </fieldset>
              </TabPanel>
              <TabPanel>
                <RegistrationFormCommonFields
                  username={state.username}
                  discordUsername={state.discordUsername}
                  emailAddress={state.emailAddress}
                  password={state.password}
                  confirmPassword={state.confirmPassword}
                  gitHubUsername={state.gitHubUsername}
                  link={state.link}
                  avatar={state.avatar}
                  avatarInputRef={avatarInputRef}
                  handleChange={handleChange}
                  handleAvatarChange={handleAvatarChange}
                  removeAvatar={removeAvatar}
                  usernameValidator={usernameValidator}
                  discordUsernameValidator={discordUsernameValidator}
                  passwordValidator={passwordValidator}
                  confirmPasswordValidator={confirmPasswordValidator}
                  submitted={status === FormStatus.SubmitAttempted}
                />
                <Input
                  label="Polygon Address"
                  helpText="Polygon address where we should send your awards"
                  required={true}
                  handleChange={handleChange}
                  value={state.polygonAddress}
                  name="polygonAddress"
                  validator={customPaymentAddressValidator}
                  forceValidation={status === FormStatus.SubmitAttempted}
                  maxLength={42}
                />
              </TabPanel>
            </Tabs>
            <div className="register__captcha-container">
              <HCaptcha
                sitekey={process.env.GATSBY_HCAPTCHA_SITE_KEY!}
                theme="dark"
                onVerify={handleCaptchaVerification}
              />
            </div>
            <fieldset>
              <Agreement />
            </fieldset>
            <div className="form__submit-button-holder">
              {status === FormStatus.Submitting ? (
                <span className={clsx("button button--primary")}>
                  Submitting...
                </span>
              ) : registrationType === RegistrationType.UsernameAndPassword ? (
                <button
                  className={clsx("button button--primary form__submit-button")}
                  type="button"
                  onClick={() => submitRegistration()}
                >
                  Register
                </button>
              ) : (
                <>
                  <button
                    className={clsx(
                      "button button--primary form__submit-button"
                    )}
                    type="button"
                    onClick={() => submitRegistration("metamask")}
                  >
                    Register with MetaMask
                  </button>
                  <button
                    className={clsx(
                      "button button--primary form__submit-button"
                    )}
                    type="button"
                    onClick={() => submitRegistration("walletConnect")}
                  >
                    Register with WalletConnect
                  </button>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {status === FormStatus.Error && (
        <>
          <h2>Sorry, an error has occurred.</h2>
          <p>An error occurred while processing your registration.</p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
          <button className="button button--primary" onClick={resetForm}>
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
    </>
  );
}
