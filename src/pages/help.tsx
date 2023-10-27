import React, { useCallback, useEffect, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import DefaultLayout from "../templates/DefaultLayout";
import FormField from "../components/reporter/widgets/FormField";
import Form from "../components/form/Form";
import Widgets from "../components/reporter/widgets/Widgets";

import useUser from "../hooks/UserContext";
import { useMoralis } from "react-moralis";
import { Input } from "../components/Input";

const initialState = {
  discordHandle: "",
  email: "",
  subject: "",
  request: "",
  description: "",
};

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
          label: "Sensitive disclosure",
          value: "sensitiveDisclosure",
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
      helpText:
        "For content longer than 2000 characters, please include a link to a gist in GitHub",
    },
  ];

  const { currentUser } = useUser();
  const { Moralis } = useMoralis();
  const [hasValidationErrors, setValidationErrors] = useState(false);
  const [fieldState, setFieldState] = useState(initialState);
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (currentUser.isLoggedIn) {
      setFieldState((prevState) => {
        return {
          ...prevState,
          email: currentUser.emailAddress,
          discordHandle: currentUser.discordUsername,
        };
      });
    } else {
      setFieldState(initialState);
    }
  }, [currentUser.isLoggedIn]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFieldState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const validateFields = useCallback(() => {
    if (
      (!fieldState.discordHandle &&
        !fieldState.email &&
        !currentUser.isLoggedIn) ||
      fields.some((field) => {
        return field.required && !fieldState[field.name];
      }) ||
      fieldState.description.length > 2000
    ) {
      setValidationErrors(true);
      return true;
    }
    setValidationErrors(false);
    return false;
  }, [fieldState, fields]);

  const handleSubmit = useCallback(async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const user = await Moralis.User.current();
    if (user && currentUser.isLoggedIn) {
      headers["X-Authorization"] = `Bearer ${user?.attributes.sessionToken}`;
      headers["C4-User"] = currentUser.username;
    } else {
      headers.Authorization = captchaToken;
    }
    const response = await fetch("/.netlify/functions/request-support", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(fieldState),
    });
    if (!response.ok) {
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    }
  }, [fieldState, currentUser, fields]);

  const handleReset = useCallback(() => {
    setCaptchaToken("");
    setFieldState(initialState);
  }, []);

  const handleCaptchaVerification = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  return (
    <DefaultLayout
      pageDescription="Need help with something? Contact us here."
      pageTitle="Help | Code4rena"
    >
      <section className="limited-width form">
        <Form
          title="How can we help?"
          successMessage="Your request has been submitted."
          submitButtonText="Submit"
          onSubmit={handleSubmit}
          successButtonText="Get help with something else"
          resetForm={handleReset}
          validator={validateFields}
        >
          {!currentUser.isLoggedIn && (
            <FormField
              name="contactInfo"
              label="Contact Information *"
              isInvalid={
                hasValidationErrors &&
                !fieldState.discordHandle &&
                !fieldState.email &&
                !currentUser.isLoggedIn
              }
              errorMessage="You must enter either your discord handle or email address"
              helpText="Please enter your discord handle or your email address so we can follow up with you"
            >
              <Input
                name="discordHandle"
                label="Discord Handle"
                value={fieldState.discordHandle}
                handleChange={handleChange}
              />
              <Input
                name="email"
                label="Email Address"
                value={fieldState.email}
                handleChange={handleChange}
              />
            </FormField>
          )}
          <Widgets
            fields={fields}
            onChange={handleChange}
            fieldState={fieldState}
            showValidationErrors={hasValidationErrors}
          />
          {!currentUser.isLoggedIn && (
            <div className="captcha-container">
              <HCaptcha
                sitekey={process.env.GATSBY_HCAPTCHA_SITE_KEY!}
                theme="dark"
                onVerify={handleCaptchaVerification}
              />
            </div>
          )}
        </Form>
      </section>
    </DefaultLayout>
  );
}

export default ContactUs;
