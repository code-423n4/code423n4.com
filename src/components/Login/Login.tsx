import React from "react";
import Moralis from "moralis-v1";
import { Link, navigate } from "gatsby";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";

// hooks
import { useModalContext } from "../../hooks/ModalContext";
import useUser, { UserLoginError } from "../../hooks/UserContext";

// components
import Dropdown from "../Dropdown";

const Login = ({ displayAsButtons = false }) => {
  const { logUserOut, connectWallet } = useUser();
  const { showModal } = useModalContext();
  const { authenticate } = useMoralis();

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
        let message: string | React.ReactNode = "";
        // @ts-ignore // @todo: fix typescript error
        if (typeof window.ethereum === "undefined") {
          // user does not have MetaMask installed
          message = (
            <>
              Please{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                install MetaMask
              </a>
            </>
          );
        } else {
          // user clicked "cancel" when prompted to sign message
          // @todo: update messaging
          message = "You must sign the message to connect your wallet";
        }
        toast.update(id, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        return;
      }
    } catch (error) {
      logUserOut();
      console.error("authenticate failed:", error);
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
              <a
                href="https://discord.gg/code4rena"
                target="_blank"
                rel="noreferrer"
              >
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
        console.error("connect wallet failed: ", error);
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

  const openLoginModal = (e: React.MouseEvent) => {
    e.preventDefault();
    showModal({
      title: "Log in",
      body: "",
      type: "login",
    });
  };

  return (
    <>
      {displayAsButtons ? (
        <div className="login__display-as-buttons">
          <button
            type="button"
            onClick={(e) => handleLogin(e)}
            className="button button--primary login__button"
          >
            <img
              src="/images/meta-mask-logo.svg"
              alt="logout icon"
              className={"login__icon"}
            />
            MetaMask
          </button>
          <button
            type="button"
            onClick={(e) => handleLogin(e, "walletConnect")}
            className="button button--primary login__button"
          >
            <img
              src="/images/wallet-connect-logo.svg"
              alt="logout icon"
              className={"login__icon"}
            />
            WalletConnect
          </button>
          <button
            className="button button--primary login__button"
            type="button"
            onClick={openLoginModal}
          >
            <img
              src="/images/sign-out.svg"
              alt="login icon"
              className={"login__icon"}
            />
            Log in with password
          </button>
          <div className="login__not-registered">
            <p>Not a warden yet?</p>
            <Link
              className="button button--secondary login__button"
              to="/register"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Dropdown
            wrapperClass={"login__button-wrapper login__desktop"}
            triggerButtonClass={"button login__button"}
            triggerButton="Connect"
            openOnHover={true}
          >
            <button
              type="button"
              onClick={(e) => handleLogin(e)}
              className="dropdown__button"
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              MetaMask
            </button>
            <button
              type="button"
              onClick={(e) => handleLogin(e, "walletConnect")}
              className="dropdown__button"
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              WalletConnect
            </button>
            <button
              className="dropdown__button"
              type="button"
              onClick={openLoginModal}
            >
              <img
                src="/images/sign-out.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Log in
            </button>
            {/* using navigate function instead of <Link> for styling purposes */}
            <button
              className="dropdown__button"
              type="button"
              onClick={() => navigate("/register")}
            >
              <img
                src="/images/register.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Register
            </button>
          </Dropdown>
          <div className={"login__mobile"}>
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleLogin(e)}
              className={"login__link"}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              Connect MetaMask
            </a>
            <a
              href=""
              onClick={(e) => handleLogin(e, "walletConnect")}
              className={"login__link"}
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              Connect WalletConnect
            </a>
            <a href="" className={"login__link"} onClick={openLoginModal}>
              <img
                src="/images/sign-out.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Log in
            </a>
            <Link className="login__link" to="/register">
              <img
                src="/images/register.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Register
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
