import React, { useCallback, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { StaticQuery, graphql } from "gatsby";

import DefaultLayout from "../templates/DefaultLayout";
import FormField from "../components/reporter/widgets/FormField";
import Widget from "../components/reporter/widgets/Widget";
import Widgets from "../components/reporter/widgets/Widgets";

import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

function ApplyForWardenCertification() {
  const fields = [];

  const contactFields = [
    {
      name: "githubUsername",
      label: "GitHub Username",
      widget: "text",
    },
    {
      name: "emailAddress",
      label: "E-mail Address",
      widget: "text",
    }
  ];

  const initialState = {
    wardenHandle: "",
    githubUsername: "",
    emailAddress: "",
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
      (!fieldState.wardenHandle && !fieldState.githubUsername && !fieldState.emailAddress) ||
      fields.some((field) => {
        return field.required && !fieldState[field.name];
      })
    ) {
      setValidationErrors(true);
      return;
    }
    setValidationErrors(false);
    submit("/.netlify/functions/apply-for-certified-warden", fieldState);
  };

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const invalidContact =
    hasValidationErrors && !fieldState.wardenHandle && !fieldState.githubUsername && !fieldState.emailAddress;

  return (
    <StaticQuery
      query={wardensQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });

        return (
          <DefaultLayout
            pageDescription="Apply to become a Certified Warden."
            pageTitle="Warden Certification Application | Code 423n4"
          >
            {(status === FormStatus.Unsubmitted ||
              status === FormStatus.Submitting) && (
              <form className={styles.Form}>
                <h1>Warden Certification Application</h1>
                <fieldset className={widgetStyles.Fields}>
                  <FormField
                    name="contactInfo"
                    label="Contact Information"
                    helpText="Select your current warden profile and enter your GitHub username; we'll handle the rest."
                    isInvalid={invalidContact}
                    errorMessage="You must select your warden profile and provide your GitHub username"
                  >
                    <Widget
                      field={{
                        name: "wardenHandle",
                        label: "Warden Handle",
                        helpText:
                          "Handle to certify",
                        widget: "warden",
                        required: true,
                        options: wardens,
                      }}
                      onChange={handleChange}
                      fieldState={fieldState}
                      isInvalid={hasValidationErrors && !fieldState.wardenHandle}
                    />
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
                  disabled={status !== FormStatus.Unsubmitted || !captchaToken}
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
                <p>Your application has been submitted.</p>
              </div>
            )}
          </DefaultLayout>
        );
      }}
    />
  );
}

export default ApplyForWardenCertification;

const wardensQuery = graphql`
  query WardensForCertification {
    allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          id
          handle
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
