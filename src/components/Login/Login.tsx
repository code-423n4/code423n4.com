import clsx from "clsx";
import React from "react";
import Moralis from "moralis/types";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import useUser, { UserLoginError } from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

import * as styles from "./Login.module.scss";
import * as dropdownStyles from "../Dropdown.module.scss";

const Login = () => {
  const { logUserOut, connectWallet } = useUser();
  const { authenticate } = useMoralis();

  const handleLogin = async (
    event: React.MouseEvent,
    provider: Moralis.Web3ProviderType = "metamask"
  ) => {
    event.preventDefault();
    try {
      const user = await authenticate({ provider });
      if (user === undefined) {
        // user clicked "cancel" when prompted to sign message
        // @todo: update messaging
        toast.error("You must sign the message to login");
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
      await connectWallet();
    } catch (error) {
      logUserOut();
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

  return (
    <>
      <Dropdown
        wrapperClass={styles.LoginButtonWrapper}
        triggerButtonClass={styles.LoginButton}
        triggerButton="Connect Wallet"
        openOnHover={true}
        className={styles.Desktop}
      >
        <button
          type="button"
          onClick={(e) => handleLogin(e)}
          className={clsx(dropdownStyles.Button, styles.Desktop)}
        >
          <img
            src="/images/meta-mask-logo.svg"
            alt="logout icon"
            className={styles.Icon}
          />
          Connect MetaMask
        </button>
        <button
          type="button"
          onClick={(e) => handleLogin(e, "walletConnect")}
          className={clsx(dropdownStyles.Button, styles.Desktop)}
        >
          <img
            src="/images/wallet-connect-logo.svg"
            alt="logout icon"
            className={styles.Icon}
          />
          Connect WalletConnect
        </button>
      </Dropdown>
      <div className={styles.Mobile}>
        <a href="" onClick={(e) => handleLogin(e)} className={styles.Link}>
          <img
            src="/images/meta-mask-logo.svg"
            alt="logout icon"
            className={styles.Icon}
          />
          Connect MetaMask
        </a>
        <a
          href=""
          onClick={(e) => handleLogin(e, "walletConnect")}
          className={styles.Link}
        >
          <img
            src="/images/wallet-connect-logo.svg"
            alt="logout icon"
            className={styles.Icon}
          />
          Connect WalletConnect
        </a>
      </div>
    </>
  );
};

export default Login;
