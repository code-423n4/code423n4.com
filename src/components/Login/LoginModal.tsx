import React, { useCallback, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { useModalContext } from "../../hooks/ModalContext";
import useUser from "../../hooks/UserContext";

import { Input } from "../Input";

const LoginModal = () => {
  const { Moralis } = useMoralis();
  const { hideModal, modalProps } = useModalContext();
  const { reFetchUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await Moralis.User.logIn(username, password);
      await reFetchUser();
    } catch (error) {
      toast.error(`Oops...something went wrong: ${error.message || error}`);
    } finally {
      setIsLoading(false);
      setUsername("");
      setPassword("");
      hideModal();
    }
  };

  const handleClose = async () => {
    if (modalProps && modalProps.secondaryButtonAction) {
      await modalProps.secondaryButtonAction();
    }
    setIsLoading(false);
    setUsername("");
    setPassword("");
    hideModal();
  };

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setUsername(e.target.value);
    },
    [username]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setPassword(e.target.value);
    },
    []
  );

  return modalProps && modalProps.type === "login" ? (
    <div className="modal">
      <form className="modal-main" onSubmit={handleSubmit}>
        <button className="button-div modal-top" onClick={handleClose}>
          <img
            src="/images/x-icon.svg"
            alt="close modal icon"
            className="closeModal-icon"
          />
        </button>
        <div className="modal-main-title">
          <h1>{modalProps.title}</h1>
        </div>
        <div className="modal-main-content">
          <Input
            name="username"
            label="Username"
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
        </div>
        <div className="modal-main-buttons">
          <button
            className="button cta-button secondary"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button className="button cta-button primary" type="submit">
            {isLoading ? "Submitting..." : "Log in"}
          </button>
        </div>
      </form>
    </div>
  ) : null;
};

export default LoginModal;
