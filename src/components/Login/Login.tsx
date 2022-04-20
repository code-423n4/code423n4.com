import React from "react";
import { useMoralis } from "react-moralis";
import useUser, { UserLoginError } from "../../hooks/UserContext";
import Moralis from "moralis/types";
import { toast } from "react-toastify";

import Dropdown from "../Dropdown";

import * as styles from "./Login.module.scss";

const Login = () => {
  const { logUserOut, login } = useUser();
  const { authenticate } = useMoralis();

  const handleLogin = async (
    provider: Moralis.Web3ProviderType = "metamask"
  ) => {
    try {
      const user = await authenticate({ provider });
      if (user === undefined) {
        // user does not have the corresponding browser extension
        // or user clicked "cancel" when prompted to sign message
        // @todo: update messaging
        toast.error(
          `Make sure you have the ${provider} browser extension \n You must sign the message to login`
        );
        return;
      }
    } catch (error) {
      console.error(error);
      await logUserOut();
      toast.error(
        "Something went wrong. Please refresh the page and try again."
      );
      return;
    }

    try {
      await login();
    } catch (error) {
      if (error === UserLoginError.Unregistered) {
        toast.error(
          "There is no account associated with the address you provided. " +
            "If you are a new user, please register. " +
            "If you registered with us previously, you may need to register again " +
            "to claim your account."
        );
      } else if (error === UserLoginError.Pending) {
        toast.error(
          <span>
            It looks like your account registration is pending. Don't forget to
            join us in{" "}
            <a href="https://discord.gg/code4rena" target="_blank">
              Discord
            </a>{" "}
            and give us a howl in #i-want-to-be-a-warden so we can complete your
            registration.
          </span>
        );
      } else {
        toast.error(
          "Something went wrong. Please refresh the page and try again."
        );
      }
    }
  };

  const loginButton = () => (
    <span>
      Login <span aria-hidden>▾</span>
    </span>
  );

  return (
    <Dropdown
      wrapperClass={styles.LoginButtonWrapper}
      triggerButtonClass={styles.LoginButton}
      triggerButton={loginButton()}
      openOnHover={true}
    >
      <button onClick={() => handleLogin()} className={styles.Button}>
        Login with MetaMask
      </button>
      <button
        onClick={() => handleLogin("walletConnect")}
        className={styles.Button}
      >
        Login with WalletConnect
      </button>
    </Dropdown>
  );
};

export default Login;
