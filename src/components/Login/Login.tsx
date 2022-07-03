import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Moralis from "moralis";
import { navigate } from "gatsby";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import useUser, { UserLoginError } from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

import * as styles from "./Login.module.scss";
import * as dropdownStyles from "../Dropdown.module.scss";

const Login = ({ displayAsButtons = false }) => {
  const { logUserOut, connectWallet } = useUser();
  const { authenticate } = useMoralis();
  const [isMetaMaskEnabled, setIsMetaMaskEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskEnabled(true);
    }
  }, []);

  const handleLogin = async (
    event: React.MouseEvent,
    provider: Moralis.Web3ProviderType = "metamask"
  ) => {
    event.preventDefault();
    const id = toast.loading("Logging in...", { autoClose: 4000 });

    try {
      const user = await authenticate({
        provider,
        signingMessage: "Code4rena login",
      });
      if (user === undefined) {
        // user clicked "cancel" when prompted to sign message
        // @todo: update messaging
        toast.update(id, {
          render: "You must sign the message to connect your wallet",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        return;
      }
    } catch (error) {
      logUserOut();
      toast.update(id, {
        render: "Something went wrong. Please refresh the page and try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      return;
    }

    try {
      await connectWallet();
      toast.update(id, {
        render: "Logged in",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    } catch (error) {
      logUserOut();
      if (error === UserLoginError.Unregistered) {
        toast.update(id, {
          render: "Please register",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        navigate("/register");
      } else if (error === UserLoginError.RegistrationPending) {
        toast.update(id, {
          render: (
            <span>
              It looks like your account registration is pending. Don't forget
              to join us in{" "}
              <a href="https://discord.gg/code4rena" target="_blank">
                Discord
              </a>{" "}
              and give us a howl in #i-want-to-be-a-warden so we can complete
              your registration.
            </span>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      } else if (error === UserLoginError.ConnectionPending) {
        toast.update(id, {
          render:
            "Your request to connect your wallet is pending review. Check the progress in GitHub",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      } else {
        toast.update(id, {
          render:
            "Something went wrong. Please refresh the page and try again.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      }
    }
  };

  return (
    <>
      {displayAsButtons ? (
        <div className={clsx(styles.NoDropdown)}>
          {isMetaMaskEnabled ? (
            <button
              type="button"
              onClick={(e) => handleLogin(e)}
              className={clsx("button", styles.SmallerButton)}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Connect MetaMask
            </button>
          ) : (
            <a
              href="https://metamask.io/"
              target="_blank"
              className={clsx("button", styles.SmallerButton)}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Install MetaMask
            </a>
          )}
          <button
            type="button"
            onClick={(e) => handleLogin(e, "walletConnect")}
            className={clsx("button", styles.SmallerButton)}
          >
            <img
              src="/images/wallet-connect-logo.svg"
              alt="logout icon"
              className={styles.Icon}
            />
            Connect WalletConnect
          </button>
        </div>
      ) : (
        <>
          <Dropdown
            wrapperClass={styles.LoginButtonWrapper}
            triggerButtonClass={styles.LoginButton}
            triggerButton="Connect Wallet"
            openOnHover={true}
            className={styles.Desktop}
          >
            {isMetaMaskEnabled ? (
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
            ) : (
              <a
                href="https://metamask.io/"
                target="_blank"
                className={clsx(dropdownStyles.Button, styles.Desktop)}
              >
                <img
                  src="/images/meta-mask-logo.svg"
                  alt="logout icon"
                  className={styles.Icon}
                />
                Install MetaMask
              </a>
            )}
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
            <a
              href={isMetaMaskEnabled ? "" : "https://metamask.io/"}
              target="_blank"
              onClick={isMetaMaskEnabled ? (e) => handleLogin(e) : null}
              className={styles.Link}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              {isMetaMaskEnabled ? "Connect MetaMask" : "Install MetaMask"}
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
      )}
    </>
  );
};

export default Login;
