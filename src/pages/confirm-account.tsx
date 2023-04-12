import clsx from "clsx";
import { navigate } from "gatsby";
import React, { useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// utils
import { generateId } from "../utils/uuid";

// hooks
import useUser from "../hooks/UserContext";

// components
import DefaultLayout from "../templates/DefaultLayout";
import Form from "../components/form/Form";
import { Input } from "../components/Input";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  SubmitAttempted = "submitAttempted",
  Loading = "loading",
}

interface userState {
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  polygonPaymentAddress: string;
}

const initialState: userState = {
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  password: "",
  confirmPassword: "",
  polygonPaymentAddress: "",
};

export default function ConfirmAccount() {
  // hooks
  const { isAuthenticated, user, isInitialized, Moralis } = useMoralis();
  const { logUserOut } = useUser();

  // state
  const [handles, setHandles] = useState<string[]>([]);
  const [confirmedHandle, setConfirmedHandle] = useState<string>("");
  const [state, setState] = useState<userState>(initialState);
  const [isValidDiscord, setIsValidDiscord] = useState(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Loading);
  const [captchaToken, setCaptchaToken] = useState("");

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
      setState((prevState) => {
        return {
          ...prevState,
          polygonPaymentAddress: user.attributes.ethAddress,
        };
      });
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
      setIsValidDiscord(value.match(/.*#[0-9]{4}/));
    }
  }, []);

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const hasValidationErrors = useCallback(() => {
    setStatus(FormStatus.SubmitAttempted);
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
      return true;
    }
    return false;
  }, [user, captchaToken, state, isValidDiscord, confirmedHandle]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }
    const userId = generateId();
    try {
      user.set("uuid", userId);
      user.set("username", confirmedHandle);
      user.set("discordUsername", state.discordUsername);
      user.set("email", state.emailAddress);
      user.set("password", state.password);
      user.set("handlesPendingConfirmation", []);
      user.set("gitHubUsername", state.gitHubUsername || undefined);
      await user.save();
      try {
        await Moralis.Cloud.run("addPaymentAddress", {
          address: state.polygonPaymentAddress,
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
      }
    } catch (error) {
      throw error.message;
    }

    const requestBody = {
      handle: confirmedHandle,
      moralisId: user.id,
      gitHubUsername: state.gitHubUsername,
      emailAddress: state.emailAddress,
      isUpdate: true,
      polygonAddress: user.attributes.ethAddress,
    };

    const response = await fetch("/.netlify/functions/register-warden", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: captchaToken,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      user.set("registrationComplete", true);
      await user.save();
      logUserOut();
    } else {
      const { error } = await response.json();
      if (error === "Reference already exists") {
        throw "It looks like your account confirmation is already pending. Check your email for a link to the PR in GitHub.";
      }
      throw error || "Something went wrong";
    }
  }, [captchaToken, user, state, confirmedHandle]);

  const validatePassword = (value: string) => {
    const validationErrors: (string | React.ReactNode)[] = [];
    if (value.length < 18) {
      validationErrors.push("Password should be at least 18 characters long.");
    }
    return validationErrors;
  };

  const validateConfirmPassword = useCallback(
    (value: string) => {
      const validationErrors: (string | React.ReactNode)[] = [];
      if (value !== state.password) {
        validationErrors.push("Passwords do not match.");
      }
      return validationErrors;
    },
    [state.password]
  );

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

  const validatePaymentAddress = (value): (string | React.ReactNode)[] => {
    const errors: string[] = [];
    if (value.length > 0 && value.length !== 42) {
      errors.push("Address must be 42 characters long");
    }
    return errors;
  };

  return (
    <DefaultLayout hideConnectWalletDropdown={true}>
      <div className="limited-width type__copy form">
        {status === FormStatus.Loading ? (
          // @todo: style a loading state
          <div>LOADING...</div>
        ) : (
          <Form
            onSubmit={handleSubmit}
            validator={hasValidationErrors}
            title={
              handles.length === 1
                ? `Welcome back, ${confirmedHandle}!`
                : "Welcome back!"
            }
            successMessage={
              <>
                <p>
                  Your wallet has successfully been connected to your account.
                </p>
                <p>
                  You should receive an email confirmation with a link to the
                  pull request to update your warden file. When the pull request
                  has been merged, that means your re-registration has been
                  fully processed and you can login to submit findings again
                  within a few minutes.
                </p>
                <p>See you in the arena! 🐺</p>
              </>
            }
          >
            {handles.length > 1 && (
              <>
                <fieldset
                  className={clsx("widget__fields", "widget__radio-group")}
                >
                  {handles.map((handle) => (
                    <label className="widget__radio-label" key={handle}>
                      <input
                        className="widget__radio"
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
            <Input
              label="Discord Username"
              required={true}
              helpText="Used in case we need to contact you about your submissions or winnings."
              name="discordUsername"
              placeholder="Warden#1234"
              value={state.discordUsername}
              handleChange={handleChange}
              validator={validateDiscordUsername}
              forceValidation={status === FormStatus.SubmitAttempted}
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
              forceValidation={status === FormStatus.SubmitAttempted}
            />
            <Input
              label="Confirm Password"
              required={true}
              name="confirmPassword"
              placeholder="Password"
              type="password"
              value={state.confirmPassword}
              handleChange={handleChange}
              validator={validateConfirmPassword}
              forceValidation={status === FormStatus.SubmitAttempted}
            />
            <Input
              label="Polygon Address"
              helpText="Polygon address where we should send your awards"
              required={true}
              handleChange={handleChange}
              value={state.polygonPaymentAddress}
              name="polygonPaymentAddress"
              validator={validatePaymentAddress}
              forceValidation={status === FormStatus.SubmitAttempted}
              maxLength={42}
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
          </Form>
        )}
      </div>
    </DefaultLayout>
  );
}
