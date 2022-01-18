import React, { useCallback, useState, useRef } from "react";
import { graphql } from "gatsby";
import clsx from "clsx";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import DefaultLayout from "../layouts/DefaultLayout";
import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";
import Agreement from "../components/content/Agreement.js";

const initialState = {
  handle: "",
  link: "",
};

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

function getFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      const data = dataUrl.substr(dataUrl.indexOf(",") + 1);
      resolve(data);
    };
    reader.onerror = (err) => reject(err);
  });
}

const WardenRegistrationForm = ({ handles }) => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const avatarInputRef = useRef();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const url = `/.netlify/functions/register-warden`;

  const submitRegistration = useCallback(() => {
    (async () => {
      setStatus(FormStatus.Submitting);
      let image = undefined;
      if (avatarInputRef.current.files.length > 0) {
        image = await getFileAsBase64(avatarInputRef.current.files[0]);
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: captchaToken,
        },
        body: JSON.stringify({
          handle: state.handle,
          link: state.link,
          image,
        }),
      });
      if (response.ok) {
        setStatus(FormStatus.Submitted);
      } else {
        setStatus(FormStatus.Error);
        console.log('response', response)
        try {
          const res = await response.json();
          updateErrorMessage(res.error);
        } catch (err) {
          setErrorMessage("");
        }
      }
    })();
  }, [avatarInputRef, state.handle, state.link, captchaToken]);

  const updateErrorMessage = (message) => {
    console.log('error message: ', message)
    if (!message) {
      setErrorMessage("");
    } else if (message === 'Reference already exists') {
      setErrorMessage("It looks like this username has already been registered. Don't forget to join us in discord and give us a howl in #i-want-to-be-a-warden");
    } else {
      setErrorMessage(message);
    }
  }

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  return (
    <div className={clsx(styles.Form)}>
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form>
          <div className={widgetStyles.Container}>
            <label htmlFor="handle" className={widgetStyles.Label}>
              Username
            </label>
            <p className={widgetStyles.Help}>
              Used to report findings, as well as display your total award
              amount on the leaderboard. Supports alphanumeric characters,
              underscores, and hyphens.
            </p>
            <input
              className={clsx(widgetStyles.Control, widgetStyles.Text)}
              style={{ marginBottom: 0 }}
              type="text"
              id="handle"
              name="handle"
              placeholder="Username"
              value={state.handle}
              onChange={handleChange}
              maxlength={25}
            />
            {handles.has(state.handle) && (
              <p className={widgetStyles.Help}>
                <small>{`${state.handle} is already a registered handle.`}</small>
              </p>
            )}
          </div>
          <div className={widgetStyles.Container}>
            <label htmlFor="link" className={widgetStyles.Label}>
              Link (Optional)
            </label>
            <p className={widgetStyles.Help}>
              Link your leaderboard entry to a personal website or social media
              account.
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
          <div className="captcha-container">
            <HCaptcha
              sitekey="4963abcb-188b-4972-8e44-2887e315af52"
              theme="dark"
              onVerify={handleCaptchaVerification}
            />
          </div>
          <Agreement />
          <button
            className="button cta-button centered"
            type="button"
            onClick={submitRegistration}
            disabled={
              captchaToken === "" ||
              status !== "unsubmitted" ||
              state.handle === "" ||
              handles.has(state.handle)
            }
          >
            {status === FormStatus.Unsubmitted
              ? "Register username"
              : "Submitting..."}
          </button>
        </form>
      )}
      {status === FormStatus.Error && (
        <div style={{ textAlign: "center" }}>
          <h1>Whoops!</h1>
          <p>
            An error occurred while attempting to register your username.
          </p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div style={{ textAlign: "center" }}>
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

export default function WardenRegistration({ data }) {
  const handles = new Set(data.allHandlesJson.edges.map((h) => h.node.handle));

  return (
    <DefaultLayout pageTitle="Warden Registration | Code 423n4">
      <div className="wrapper-main">
        <h1 className="page-header">Warden Registration</h1>
        <WardenRegistrationForm handles={handles} />
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
