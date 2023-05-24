import React, { useState } from "react";
import { StaticQuery, graphql } from "gatsby";

import Widgets from "../components/reporter/widgets/Widgets";
import useUser from "../hooks/UserContext";
import { useMoralis } from "react-moralis";

import ProtectedPage from "../components/ProtectedPage";

const config = {
  labelAll: "candidate",
  fields: [
    {
      name: "bio",
      label: "Tell us about yourself",
      helpText: "Short bio/intro and summary of relevant experience",
      widget: "textarea",
      required: true,
    },
    {
      name: "experience",
      label: "Do you have experience evaluating other people's work?",
      helpText:
        "(e.g. instructor, teaching assistant, team manager, etc.) If so, please tell us a little about it.",
      widget: "textarea",
      required: false,
    },
    {
      name: "questions",
      label: "What questions do you have about the Lookout Guidelines?",
      helpText: (
        <a
          href="https://code4rena.notion.site/Pre-sort-Lookout-Guidelines-bead139f7ec9469197c7d46f759d89d5"
          target="_blank"
          rel="noreferrer"
        >
          Read the Lookout Guidelines ↗
        </a>
      ),
      widget: "textarea",
      required: false,
    },
    {
      name: "link1",
      label: "First Code4rena finding link",
      helpText: "Link to a valid finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details1",
      label: "First Code4rena finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
    {
      name: "link2",
      label: "Second Code4rena finding link",
      helpText: "Link to a valid finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details2",
      label: "Second Code4rena finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
    {
      name: "link3",
      label: "Third Code4rena finding link",
      helpText: "Link to a valid finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details3",
      label: "Third Code4rena finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
  ],
};

const textareaHint = "## accepts markdown";

const initialState = {
  bio: textareaHint,
  experience: textareaHint,
  questions: textareaHint,
  link1: "",
  details1: textareaHint,
  link2: "",
  details2: textareaHint,
  link3: "",
  details3: textareaHint,
};

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const wardenListLookoutQuery = graphql`
  query WardenListLookout {
    allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          id
          handle
          image {
            childImageSharp {
              resize(width: 80) {
                src
              }
            }
          }
        }
      }
    }
  }
`;

const LookoutApplication = () => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState("unsubmitted");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const fields = config.fields;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  };

  const applyForLookout = async (data) => {
    const url = `/.netlify/functions/apply-for-lookout`;
    setStatus(FormStatus.Submitting);
    const sessionToken = user.attributes.sessionToken;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
        "C4-User": currentUser.username,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setStatus(FormStatus.Submitted);
    } else {
      const { error } = await response.json();
      setStatus(FormStatus.Error);
      setErrorMessage(error);
    }
  };

  const handleSubmit = () => {
    if (!isInitialized || !user || !currentUser.isLoggedIn) {
      return;
    }
    if (
      !state.bio ||
      !state.details1 ||
      !state.details2 ||
      !state.details3 ||
      !state.link1 ||
      !state.link2 ||
      !state.link3
    ) {
      setHasValidationErrors(true);
      return;
    }
    const formData = {
      bio: state.bio,
      link1: state.link1,
      details1: state.details1,
      link2: state.link2,
      details2: state.details2,
      link3: state.link3,
      details3: state.details3,
    };
    applyForLookout(formData);
  };

  return (
    <StaticQuery
      query={wardenListLookoutQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });
        fields[0].options = wardens;

        return (
          <ProtectedPage
            bodyClass="lookout-application"
            pageTitle="Lookout Application | Code4rena"
          >
            <div className="limited-width">
              {(status === FormStatus.Unsubmitted ||
                status === FormStatus.Submitting) && (
                <>
                  <h1 className="page-header">Lookout Application</h1>
                  <form>
                    <Widgets
                      fields={fields}
                      onChange={handleChange}
                      fieldState={state}
                      showValidationErrors={hasValidationErrors}
                    />
                    <div className="form__submit-button-holder">
                      <button
                        className="button form__submit-button"
                        type="button"
                        onClick={handleSubmit}
                      >
                        {status === FormStatus.Submitting
                          ? "Submitting..."
                          : "Apply to be a Lookout"}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {status === FormStatus.Submitted && (
                <div className="lookout-application__thank-you">
                  <h1>Thanks for applying!</h1>
                  <h2>Here's what happens next:</h2>
                  <ol>
                    <li>
                      Lookout applications are reviewed by the C4 lookout
                      selection committee, which includes top leaderboard
                      wardens and past judges. The committee will review your
                      application and give you a "yes" or "not yet".
                    </li>
                    <li>
                      The review process begins after the application window
                      closes, and we expect it to take about a week, depending
                      on the number of applications.
                    </li>
                    <li>
                      You'll be contacted via DM to let you know if your
                      application has been successful this time around.
                    </li>
                    <li>
                      If you're accepted as a lookout, an organizer will onboard
                      you and get you set up to lookout your first contest!
                    </li>
                  </ol>
                  <p>
                    <strong>
                      In the meantime, if you have questions, feel free to reach
                      out to us in the C4 Discord.
                    </strong>
                  </p>
                </div>
              )}
              {status === FormStatus.Error && (
                <div className="centered-text">
                  <h1>Whoops!</h1>
                  <p>
                    An error occurred; please try again. If you continue to
                    receive this error, let us know in{" "}
                    <a href="https://discord.gg/code4rena">Discord</a>.
                  </p>
                  {errorMessage && <p>"{errorMessage}"</p>}
                  <div className="form__submit-button-holder">
                    <button
                      className="button form__submit-button"
                      type="button"
                      onClick={() => setStatus(FormStatus.Unsubmitted)}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ProtectedPage>
        );
      }}
    />
  );
};

export default LookoutApplication;
