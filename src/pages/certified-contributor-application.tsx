import clsx from "clsx";
import { StaticQuery, graphql } from "gatsby";
import DOMPurify from "isomorphic-dompurify";
import React, { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import { Input } from "../components/Input";
import ProtectedPage from "../components/ProtectedPage";

function ApplyForCertifiedContributor() {
  enum FormStatus {
    Unsubmitted = "unsubmitted",
    Submitting = "submitting",
    Submitted = "submitted",
    Error = "error",
  }

  // state
  const [status, setStatus] = useState<FormStatus>(FormStatus.Unsubmitted);
  const [errorMessage, setErrorMessage] = useState<string>("An error occurred");
  const [acceptedAgreement, setAcceptedAgreement] = useState<boolean>(false);
  const [gitHubUsername, setGitHubUsername] = useState<string>("");

  // hooks
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  useEffect(() => {
    if (!isInitialized || !currentUser.isLoggedIn) {
      return;
    }
    setGitHubUsername(currentUser.gitHubUsername);
  }, [isInitialized, currentUser]);

  const submit = async (url, data) => {
    const sessionToken = user.attributes.sessionToken;
    setStatus(FormStatus.Submitting);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
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

  const handleAgreement = useCallback(() => {
    setAcceptedAgreement(!acceptedAgreement);
  }, [acceptedAgreement]);

  const handleSubmit = () => {
    if (!acceptedAgreement || !currentUser.isLoggedIn || !isInitialized) {
      return;
    }

    const payload = {
      wardenHandle: currentUser.username,
      gitHubUsername: gitHubUsername,
      emailAddress: currentUser.emailAddress,
    };
    submit("/.netlify/functions/apply-for-certified-contributor", payload);
  };

  return (
    <StaticQuery
      query={pageQuery}
      render={(data) => {
        return (
          <ProtectedPage
            pageDescription="Apply to become a Certified Warden."
            pageTitle="Certified Warden Application | Code 423n4"
          >
            <div className="limited-width type__copy">
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
                <form className="form spacing-bottom__xl spacing-top__xl">
                  <h1>Certification Application</h1>
                  <Input
                    label="Github Username"
                    handleChange={(e) => setGitHubUsername(e.target.value)}
                    value={gitHubUsername}
                    name="gitHubUsername"
                    required={true}
                  />
                  <label htmlFor="acceptAgreeement" className="widget__control">
                    <input
                      type="checkbox"
                      id="acceptAgreeement"
                      checked={acceptedAgreement}
                      onChange={handleAgreement}
                      className={"widget__checkbox"}
                    />
                    I have read and agree to the terms and conditions (see
                    below)
                    {!acceptedAgreement && (
                      <label
                        htmlFor="acceptAgreeement"
                        className={"widget__error-message"}
                      >
                        <small>
                          You must accept the terms and conditions to apply.
                        </small>
                      </label>
                    )}
                  </label>
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      status !== FormStatus.Unsubmitted ||
                      !acceptedAgreement ||
                      !gitHubUsername
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
                <div>
                  <h1>Thank you!</h1>
                  <p>
                    Your application has been submitted, and we will review it
                    ASAP. Please note:
                  </p>
                  <ul>
                    <li>You should receive a confirmation email shortly</li>
                    <li>
                      The DAO's AML/KYC agent,{" "}
                      <a href="https://provenance.company/">Provenance</a>, will
                      contact you to certify your identity.{" "}
                      <strong>
                        Please watch for an email that will come directly from
                        Provenance (https://provenance.company/).
                      </strong>
                    </li>
                    <li>
                      Every application is processed individually, requires
                      several people's input, and takes time to review. We
                      appreciate your patience!
                    </li>
                  </ul>
                  <p>
                    More details on this process can be found in the{" "}
                    <a href="https://docs.code4rena.com/roles/wardens/certified-wardens#certification-process-and-constraints">
                      C4 docs.
                    </a>
                  </p>
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
          </ProtectedPage>
        );
      }}
    />
  );
}

export default ApplyForCertifiedContributor;

const pageQuery = graphql`
  query {
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
