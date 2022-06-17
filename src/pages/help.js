import React, { useCallback, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import DefaultLayout from "../templates/DefaultLayout";
import FormField from "../components/reporter/widgets/FormField";
import Widget from "../components/reporter/widgets/Widget";
import Widgets from "../components/reporter/widgets/Widgets";

import * as styles from "../components/form/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

function ContactUs() {
  const fields = [
    {
      name: "request",
      label: "What type of problem do you need help with?",
      widget: "select",
      required: true,
      options: [
        {
          label: "Warden registration",
          value: "wardenRegistration",
        },
        {
          label: "Update polygon address",
          value: "walletUpdate",
        },
        {
          label: "Change or withdraw a finding I submitted",
          value: "findingsChange",
        },
        {
          label: "Report a bug or issue with documentation",
          value: "bug",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
    },
    {
      name: "subject",
      label: "Subject",
      widget: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      widget: "textarea",
      maxSize: 2000,
      required: true,
      helpText: "For content longer than 2000 characters, please include a link to a gist in GitHub"
    },
  ];

  const contactFields = [
    {
      name: "discordHandle",
      label: "Discord Handle",
      widget: "text",
    },
    {
      name: "email",
      label: "Email Address",
      widget: "text",
    },
  ];

  const initialState = {
    discordHandle: "",
    email: "",
    subject: "",
    request: "",
    description: "",
  };

  const FormStatus = {
    Unsubmitted: "unsubmitted",
    Submitting: "submitting",
    Submitted: "submitted",
    Error: "error",
  };

  const [hasValidationErrors, setValidationErrors] = useState(false);
  const [fieldState, setFieldState] = useState(initialState);
  const [status, setStatus] = useState(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const [captchaToken, setCaptchaToken] = useState("");

  const submit = async (url, data) => {
    setStatus(FormStatus.Submitting);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: captchaToken,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setStatus(FormStatus.Submitted);
    } else {
      setStatus(FormStatus.Error);
      const res = await response.json();
      if (res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFieldState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const handleSubmit = () => {
    if (
      (!fieldState.discordHandle && !fieldState.email) ||
      fields.some((field) => {
        return field.required && !fieldState[field.name];
      }) || fieldState.description.length > 2000
    ) {
      setValidationErrors(true);
      return;
    }
    setValidationErrors(false);
    submit("/.netlify/functions/request-support", fieldState);
  };

  const handleReset = () => {
    setCaptchaToken("");
    setFieldState(initialState);
    setStatus(FormStatus.Unsubmitted);
  };

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const invalidContact =
    hasValidationErrors && !fieldState.discordHandle && !fieldState.email;

  return (
    <DefaultLayout
      pageDescription="Need help with something? Contact us here."
      pageTitle="Help | Code 423n4"
    >
      {(status === FormStatus.Unsubmitted ||
        status === FormStatus.Submitting) && (
        <form className={styles.Form}>
          <h1>How can we help?</h1>
          <fieldset className={widgetStyles.Fields}>
            <FormField
              name="contactInfo"
              label="Contact Information"
              helpText="Please enter your discord handle or your email address so we can follow up with you"
              isInvalid={invalidContact}
              errorMessage="You must enter either your discord handle or email address"
            >
              {contactFields.map((field, index) => {
                return (
                  <div key={field.name + index}>
                    <label>{field.label}</label>
                    <Widget
                      field={field}
                      onChange={handleChange}
                      fieldState={fieldState}
                      isInvalid={invalidContact}
                    />
                  </div>
                );
              })}
            </FormField>
            <Widgets
              fields={fields}
              onChange={handleChange}
              fieldState={fieldState}
              showValidationErrors={hasValidationErrors}
            />
          </fieldset>
          <div className="captcha-container">
            <HCaptcha
              sitekey="4963abcb-188b-4972-8e44-2887e315af52"
              theme="dark"
              onVerify={handleCaptchaVerification}
            />
          </div>
          <button
            className="button cta-button centered"
            type="button"
            onClick={handleSubmit}
            disabled={status !== FormStatus.Unsubmitted || !captchaToken || fieldState.description.length > 2000}
          >
            {status === FormStatus.Unsubmitted ? "Submit" : "Submitting..."}
          </button>
        </form>
      )}
      {status === FormStatus.Error && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
      {status === FormStatus.Submitted && (
        <div className="centered-text">
          <h1>Thank you!</h1>
          <p>Your request has been submitted.</p>
          <button
            className="button cta-button"
            type="button"
            onClick={handleReset}
          >
            Get help with something else
          </button>
        </div>
      )}
    </DefaultLayout>
  );
}

export default ContactUs;
