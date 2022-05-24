import React, { useCallback, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { StaticQuery, graphql } from "gatsby";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";

import DefaultLayout from "../templates/DefaultLayout";
import Widget from "../components/reporter/widgets/Widget";
import Widgets from "../components/reporter/widgets/Widgets";

import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

function ApplyForCertifiedContributor() {
  const fields = [];

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
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);

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

  const handleAgreement = useCallback(() => {
    setAcceptedAgreement(!acceptedAgreement);
  }, [acceptedAgreement]);

  const handleSubmit = () => {
    if (
      !fieldState.wardenHandle ||
      !fieldState.githubUsername ||
      !fieldState.emailAddress ||
      !acceptedAgreement ||
      fields.some((field) => {
        return field.required && !fieldState[field.name];
      })
    ) {
      setValidationErrors(true);
      return;
    }
    setValidationErrors(false);
    submit("/.netlify/functions/apply-for-certified-contributor", fieldState);
  };

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  return (
    <StaticQuery
      query={pageQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });

        const contactFields = [
          {
            name: "wardenHandle",
            label: "Warden Handle",
            helpText: "Handle to certify",
            widget: "warden",
            required: true,
            options: wardens,
          },
          {
            name: "githubUsername",
            label: "GitHub Username",
            widget: "text",
            required: true,
          },
          {
            name: "emailAddress",
            label: "E-mail Address",
            widget: "text",
            required: true,
          },
        ];

        return (
          <DefaultLayout
            pageDescription="Apply to become a Certified Warden."
            pageTitle="Certified Warden Application | Code 423n4"
          >
            <div className="wrapper-main">
              <h1 className="page-header">Certified Wardens</h1>
              {status === FormStatus.Unsubmitted && (
                <article
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      data.contributorTermsSummary.html
                    ),
                  }}
                />
              )}
              {(status === FormStatus.Unsubmitted ||
                status === FormStatus.Submitting) && (
                <form className={styles.Form}>
                  <h1>Certification Application</h1>
                  <fieldset className={widgetStyles.Fields}>
                    {contactFields.map((field, index) => {
                      return (
                        <div key={field.name + index}>
                          <label>{field.label}</label>
                          <Widget
                            name={field.name}
                            field={field}
                            onChange={handleChange}
                            fieldState={fieldState}
                            isInvalid={
                              hasValidationErrors && !fieldState[field.name]
                            }
                            required={field.required}
                          />
                        </div>
                      );
                    })}
                    <Widgets
                      fields={fields}
                      onChange={handleChange}
                      fieldState={fieldState}
                      showValidationErrors={hasValidationErrors}
                    />
                    <label
                      className={clsx(
                        hasValidationErrors &&
                          !acceptedAgreement &&
                          "input-error"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={acceptedAgreement}
                        onChange={handleAgreement}
                      />
                      I have read and agree to the terms and conditions (see
                      below)
                    </label>
                  </fieldset>
                  <div
                    className="captcha-container"
                    style={{ "justify-content": "left", "margin-top": "20px" }}
                  >
                    <HCaptcha
                      sitekey="4963abcb-188b-4972-8e44-2887e315af52"
                      theme="dark"
                      onVerify={handleCaptchaVerification}
                    />
                  </div>
                  <button
                    className="button cta-button"
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      status !== FormStatus.Unsubmitted || !captchaToken
                    }
                  >
                    {status === FormStatus.Unsubmitted
                      ? "Submit"
                      : "Submitting..."}
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
              {status === FormStatus.Unsubmitted && (
                <article
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.contributorTerms.html),
                  }}
                />
              )}
            </div>
          </DefaultLayout>
        );
      }}
    />
  );
}

export default ApplyForCertifiedContributor;

const pageQuery = graphql`
  query {
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
    contributorTerms: markdownRemark(
      frontmatter: {
        title: { eq: "Certified Contributor Terms and Conditions" }
      }
    ) {
      html
    }
    contributorTermsSummary: markdownRemark(
      frontmatter: { title: { eq: "Certified Contributor Summary" } }
    ) {
      html
    }
  }
`;
