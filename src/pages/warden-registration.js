import React, { useCallback, useState, useRef } from "react";
import { graphql } from "gatsby";
import clsx from "clsx";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import DefaultLayout from "../layouts/DefaultLayout";
import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

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
  const [status, setStatus] = useState("unsubmitted");
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

  const submitFinding = useCallback(() => {
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
        try {
          const res = await response.json();
          if (res.error) {
            setErrorMessage(res.error);
          }
        } catch (err) {
          setErrorMessage("");
        }
      }
    })();
  }, [avatarInputRef, state.handle, state.link, captchaToken]);

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
              Handle
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
              placeholder="Handle"
              value={state.handle}
              onChange={handleChange}
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <HCaptcha
              sitekey="4963abcb-188b-4972-8e44-2887e315af52"
              theme="dark"
              onVerify={handleCaptchaVerification}
            />
          </div>
          <button
            className={styles.Button}
            type="button"
            onClick={submitFinding}
            disabled={
              captchaToken === "" ||
              status !== "unsubmitted" ||
              state.handle === "" ||
              handles.has(state.handle)
            }
          >
            {status === FormStatus.Unsubmitted
              ? "Register handle"
              : "Submitting..."}
          </button>
        </form>
      )}
      {status === FormStatus.Error && (
        <div style={{ textAlign: "center" }}>
          <h1>Whoops!</h1>
          <p>
            An error occurred while attempting to register your handle. Please
            try again later.
          </p>
          {errorMessage !== "" && (
            <p>
              <small>{errorMessage}</small>
            </p>
          )}
        </div>
      )}
      {status === FormStatus.Unsubmitted && (
        <div style={{ textAlign: "center" }}>
          <h1>Thank you!</h1>
          <p>
            Your handle has been registered, and you're ready to submit
            findings.
            <br />
            We look forward to seeing you in the arena!
          </p>
          <h2>One more thing...</h2>
          <p>
            Join us in <a href="https://discord.gg/code4rena">Discord</a> and
            give us a howl in #i-want-to-be-a-warden!
          </p>
        </div>
      )}
    </div>
  );
};

export default function WardenRegistration({ data }) {
  const handles = new Set(data.allHandlesJson.edges.map((h) => h.node.handle));
  console.log({ handles });

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
