import { Link } from "gatsby";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

// hooks
import { useModalContext } from "../../hooks/ModalContext";
import useUser from "../../hooks/UserContext";

// components
import { Input } from "../Input";

const LoginModal = () => {
  const { Moralis } = useMoralis();
  const { hideModal, modalProps } = useModalContext();
  const { reFetchUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      // @todo: replace this with inline form validation
      toast.error("You must enter both username and password to log in.");
      return;
    }
    setIsLoading(true);
    try {
      await Moralis.User.logIn(username, password);
      await reFetchUser();
      toast.success("Logged in");
    } catch (error) {
      toast.error(`Oops...something went wrong: ${error.message || error}`);
    } finally {
      resetState();
      hideModal();
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    try {
      await Moralis.User.requestPasswordReset(emailAddress);
      toast.success(`Password reset link has been sent to ${emailAddress}`);
      resetState();
    } catch (error) {
      // @todo: add inline form validation for email address field
      toast.error(
        `Oops...something went wrong while resetting your password: ${
          error.message || error
        }`
      );
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    if (modalProps && modalProps.secondaryButtonAction) {
      await modalProps.secondaryButtonAction();
    }
    resetState();
    hideModal();
  };

  const resetState = () => {
    setIsLoading(false);
    setUsername("");
    setPassword("");
    setEmailAddress("");
    setForgotPassword(false);
  };

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(e.target.value);
  };

  const handleEmailAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmailAddress(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.target.value);
  };

  const toggleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPassword(!forgotPassword);
  };

  return modalProps && modalProps.type === "login" ? (
    <div className="modal">
      <form className="modal--main" onSubmit={handleSubmit}>
        <button className="button-div modal-top" onClick={handleClose}>
          <img
            src="/images/x-icon.svg"
            alt="close modal icon"
            className="modal--close-modal-icon"
          />
        </button>
        <div className="modal--main-title">
          <h1>{modalProps.title}</h1>
        </div>
        {forgotPassword ? (
          <>
            <div className="modal--main-content">
              <Input
                name="emailAddress"
                label="Email Address"
                required={true}
                value={emailAddress}
                handleChange={handleEmailAddressChange}
              />
              <p>
                <a href="" onClick={toggleForgotPassword}>
                  ← Back to log in
                </a>
              </p>
            </div>
            <div className="modal--main-buttons">
              <button
                className="button cta-button primary"
                type="button"
                onClick={handlePasswordReset}
              >
                {isLoading ? "Submitting..." : "Reset Password"}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal--main-content">
              <Input
                name="username"
                label="Code4rena Username"
                required={true}
                value={username}
                handleChange={handleUsernameChange}
              />
              <Input
                name="password"
                type="password"
                label="Password"
                required={true}
                value={password}
                handleChange={handlePasswordChange}
              />
              <a
                href=""
                className="centered-text"
                onClick={toggleForgotPassword}
              >
                Forgot password?
              </a>
            </div>
            <div className="modal--main-buttons">
              <button className="button button--primary" type="submit">
                {isLoading ? "Submitting..." : "Log in"}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
            <div className={"login__dividing-line"}></div>
            <span>
              Not a warden yet?{" "}
              <Link to="/register" onClick={handleClose}>
                Sign up
              </Link>
            </span>
          </>
        )}
      </form>
    </div>
  ) : null;
};

export default LoginModal;
