import React, { useCallback, useState, useRef, ReactNode } from "react";
import { graphql } from "gatsby";
import clsx from "clsx";
import { useMoralis } from "react-moralis";
import Moralis from "moralis/types";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";
import WardenField from "../components/reporter/widgets/WardenField";

import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

const initialState = {
  username: "",
  discordUsername: "",
  link: "",
};

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
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

const RegistrationForm = ({ handles, users }) => {
  const [state, setState] = useState(initialState);
  const [isNewUser, setIsNewUser] = useState(true);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>("");
  const avatarInputRef = useRef<HTMLInputElement>();
  const { logUserOut } = useUser();
  const { authenticate } = useMoralis();

  const wardens = users.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const submitRegistration = useCallback(
    (provider: Moralis.Web3ProviderType = "metamask") => {
      const url = `/.netlify/functions/register-warden`;
      (async () => {
        setStatus(FormStatus.Submitting);
        let image = undefined;
        try {
          if (avatarInputRef && avatarInputRef.current.files.length > 0) {
            image = await getFileAsBase64(avatarInputRef.current?.files[0]);
          }
          const user = await authenticate({ provider });
          const username = await user.get("c4Username");
          if (username) {
            logUserOut();
            updateErrorMessage("Reference already exists");
            return;
          }
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              handle: state.username,
              link: state.link,
              image,
            }),
          });
          if (response.ok) {
            try {
              await user.set("c4Username", state.username);
              await user.save();
              await logUserOut();
            } catch (error) {
              await logUserOut();
              setStatus(FormStatus.Error);
              updateErrorMessage(
                "Something went wrong. Please refresh the page and try again."
              );
              console.error(error);
            }
            setStatus(FormStatus.Submitted);
          } else {
            setStatus(FormStatus.Error);
            try {
              const res = await response.json();
              updateErrorMessage(res.error);
            } catch (error) {
              setErrorMessage("");
            }
          }
        } catch (error) {
          setStatus(FormStatus.Error);
          updateErrorMessage(error);
        }
      })();
    },
    [avatarInputRef, state.username, state.link, isNewUser]
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

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsNewUser(event.target.value === "newUser");
  };

  return (
    // @todo: support team registration (needs to include a list of members with avatars, discord usernames, and links)
    <div className={clsx(styles.Form)}>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <fieldset
            className={clsx(widgetStyles.Fields, widgetStyles.RadioGroup)}
          >
            <label>
              <input
                className={widgetStyles.Radio}
                type="radio"
                value="establishedUser"
                name="isNewUser"
                checked={!isNewUser}
                onChange={handleFormChange}
              />
              I'm an established warden
            </label>
            <label>
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
          </fieldset>
          {instructions}
          {isNewUser ? (
            <>
              <div className={widgetStyles.Container}>
                <label htmlFor="username" className={widgetStyles.Label}>
                  Code4rena Username
                </label>
                <p className={widgetStyles.Help}>
                  Used to report findings, as well as display your total award
                  amount on the leaderboard. Supports alphanumeric characters,
                  underscores, and hyphens. (Note: for consistency, please
                  ensure your server nickname in our Discord matches the
                  username you provide here)
                </p>
                <input
                  className={clsx(widgetStyles.Control, widgetStyles.Text)}
                  style={{ marginBottom: 0 }}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={state.username}
                  onChange={handleChange}
                  maxLength={25}
                />
                {handles.has(state.username) && (
                  <p className={widgetStyles.Help}>
                    <small>{`${state.username} is already a registered username.`}</small>
                  </p>
                )}
              </div>
              <div className={widgetStyles.Container}>
                <label htmlFor="discordUsername" className={widgetStyles.Label}>
                  Discord Username
                </label>
                <p className={widgetStyles.Help}>
                  Used in case we need to contact you about your submissions or
                  winnings.
                </p>
                <input
                  className={clsx(widgetStyles.Control, widgetStyles.Text)}
                  style={{ marginBottom: 0 }}
                  type="text"
                  id="discordUsername"
                  name="discordUsername"
                  placeholder="Warden#1234"
                  value={state.discordUsername}
                  onChange={handleChange}
                  maxLength={25}
                />
                {/* {todo: validate discord handle} */}
                {/* {(
                  <p className={widgetStyles.Help}>
                    <small>
                      Make sure you enter your discord handle,
                      and not your server nickname. It should end with 
                      '#' followed by 4 digits.
                    </small>
                  </p>
                )} */}
              </div>
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
                  placeholder="Link"
                  value={state.link}
                  onChange={handleChange}
                />
              </div>
              <div className={widgetStyles.Container}>
                <label htmlFor="avatar" className={widgetStyles.Label}>
                  Avatar (Optional)
                </label>
                <p className={widgetStyles.Help}>
                  An avatar displayed next to your name on the leaderboard.
                </p>
                <input
                  className={widgetStyles.Control}
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept=".png,.jpg,.jpeg,.webp"
                  ref={avatarInputRef}
                />
              </div>
            </>
          ) : (
            <>
              <div className={widgetStyles.Container}>
                <label className={widgetStyles.Label}>Code4rena Username</label>
                <p className={widgetStyles.Help}>
                  The username you use to submit your findings
                </p>
                <WardenField
                  options={wardens}
                  onChange={(handle) =>
                    setState((state) => {
                      return { ...state, username: handle.value };
                    })
                  }
                  fieldState={state}
                  isInvalid={
                    status === FormStatus.Submitting && !state.username
                  }
                />
              </div>
              <div className={widgetStyles.Container}>
                <label htmlFor="discordUsername" className={widgetStyles.Label}>
                  Discord Username
                </label>
                <p className={widgetStyles.Help}>
                  Used in case we need to contact you about your submissions or
                  winnings.
                </p>
                <input
                  className={clsx(widgetStyles.Control, widgetStyles.Text)}
                  style={{ marginBottom: 0 }}
                  type="text"
                  id="discordUsername"
                  name="discordUsername"
                  placeholder="Warden#1234"
                  value={state.discordUsername}
                  onChange={handleChange}
                  maxLength={25}
                />
                {/* {@todo: validate discord handle} */}
                {/* {(
                  <p className={widgetStyles.Help}>
                    <small>
                      Make sure you enter your discord handle,
                      and not your server nickname. It should end with 
                      '#' followed by 4 digits.
                    </small>
                  </p>
                )} */}
              </div>
            </>
          )}
          <div className={styles.ButtonsWrapper}>
            <button
              className={clsx("button cta-button", styles.Button)}
              type="button"
              onClick={() => submitRegistration()}
              disabled={
                status !== "unsubmitted" ||
                state.username === "" ||
                handles.has(state.username)
              }
            >
              Register with MetaMask
            </button>
            <button
              className={clsx("button cta-button", styles.Button)}
              type="button"
              onClick={() => submitRegistration("walletConnect")}
              disabled={
                status !== "unsubmitted" ||
                state.username === "" ||
                handles.has(state.username)
              }
            >
              Register with WalletConnect
            </button>
          </div>
        </form>
      )}
      {status === FormStatus.Error && (
        <div style={{ textAlign: "center" }}>
          <h1>Whoops!</h1>
          <p>An error occurred while attempting to register your username.</p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div className="centered-text">
          <h1>Thank you!</h1>
          <p>Your username has been submitted for registration.</p>
          <h2>One more thing...</h2>
          <p>
            Before we can register you, please join us in{" "}
            <a href="https://discord.gg/code4rena">Discord</a> and give us a
            howl in #i-want-to-be-a-warden! <br />
            We look forward to seeing you in the arena!
          </p>
        </div>
      )}
    </div>
  );
};

export default function UserRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));

  return (
    <DefaultLayout pageTitle="Registration | Code 423n4">
      <div className="wrapper-main">
        <h1 className="page-header">Register Your Handle</h1>
        <RegistrationForm handles={handles} users={data.handles.edges} />
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
          link
          image {
            childImageSharp {
              resize(width: 64, quality: 90) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
