import clsx from "clsx";
import { graphql } from "gatsby";
import React, { useState, ReactNode } from "react";

import DefaultLayout from "../templates/DefaultLayout";
import TeamRegistrationForm from "../components/TeamRegistrationForm";
import useUser from "../hooks/UserContext";

import * as styles from "../components/reporter/Form.module.scss";

enum FormStatus {
  Unsubmitted = "unsubmitted",
  Submitting = "submitting",
  Submitted = "submitted",
  Error = "error",
}

export default function TeamRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>("");
  const { currentUser } = useUser();

  let wardens: { value: string; image: string }[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  const updateErrorMessage = (message: string | undefined): void => {
    if (!message) {
      setErrorMessage("");
    } else if (message === "Reference already exists") {
      setErrorMessage(
        <span>
          It looks like a team with this name has already been registered. Don't
          forget to join us in{" "}
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

  const resetForm = (): void => {
    setErrorMessage("");
    setStatus(FormStatus.Unsubmitted);
  };

  return (
    <DefaultLayout pageTitle="Team Registration | Code 423n4">
      {currentUser.isLoggedIn ? (
        <div className="wrapper-main">
          <h1 className="page-header">Register a Team</h1>
          <div>
            {(status === FormStatus.Unsubmitted ||
              status === FormStatus.Submitting) && (
              <>
                <p className="center">
                  Before you register your team, please ensure each member has
                  connected their wallet to their C4 account.
                </p>
                <TeamRegistrationForm
                  className={clsx(styles.Form)}
                  handles={handles}
                  wardens={wardens}
                  updateErrorMessage={updateErrorMessage}
                  formStatus={status}
                  updateFormStatus={setStatus}
                />
              </>
            )}
            {status === FormStatus.Error && (
              <div style={{ textAlign: "center" }}>
                <h1>Whoops!</h1>
                <p>An error occurred while processing your registration.</p>
                {errorMessage !== "" && (
                  <p>
                    <small>{errorMessage || ""}</small>
                  </p>
                )}
                <button className="button cta-button" onClick={resetForm}>
                  Try again
                </button>
              </div>
            )}
            {status === FormStatus.Submitted && (
              <div className="centered-text">
                <h1>Thank you!</h1>
                <p>Your registration application has been submitted.</p>
                <h2>One more thing...</h2>
                <p>
                  Before we can complete your registration, please join us in{" "}
                  <a href="https://discord.gg/code4rena">Discord</a> and give us
                  a howl in #i-want-to-be-a-warden! <br />
                  We look forward to seeing you in the arena!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // @todo: style this
        <p className="centered-text">
          You must be logged in to register a team
        </p>
      )}
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
          moralisId
          members {
            handle
          }
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
