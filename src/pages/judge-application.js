import React, {
  useCallback,
  useState,
  // useRef
} from "react";
import { StaticQuery, graphql } from "gatsby";

import DefaultLayout from "../templates/DefaultLayout";
import Widgets from "../components/reporter/widgets/Widgets";
// import clsx from "clsx";
// import HCaptcha from "@hcaptcha/react-hcaptcha";
// import * as styles from "../components/form/Form.module.scss";
// import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

const config = {
  labelAll: "candidate",
  fields: [
    {
      name: "handle",
      label: "Warden handle",
      helpText: "Handle you're competing under",
      widget: "warden",
      required: true,
      options: [],
    },
    {
      name: "bio",
      label: "Tell us about yourself",
      helpText: "Short bio/intro and summary of relevant experience",
      widget: "textarea",
      required: true,
    },
    {
      name: "link1",
      label: "First high severity finding link",
      helpText:
        "Link to a valid, high-severity finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details1",
      label: "First high severity finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
    {
      name: "link2",
      label: "Second high severity finding link",
      helpText:
        "Link to a valid, high-severity finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details2",
      label: "Second high severity finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
    {
      name: "link3",
      label: "Third high severity finding link",
      helpText:
        "Link to a valid, high-severity finding you submitted to a Code4rena contest",
      widget: "text",
      required: true,
    },
    {
      name: "details3",
      label: "Third high severity finding details",
      helpText:
        "Describe how the above finding demonstrates your depth of knowledge",
      widget: "textarea",
      required: true,
    },
  ],
};

const textareaHint = "## accepts markdown";

const initialState = {
  handle: "",
  bio: textareaHint,
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

const wardenListQuery = graphql`
  query WardenList {
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

const JudgeApplication = () => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState("unsubmitted");

  const fields = config.fields;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const url = `/.netlify/functions/apply-for-judge`;

  const applyForJudge = useCallback((url, data) => {
    (async () => {
      setStatus(FormStatus.Submitting);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("success");
        setStatus(FormStatus.Submitted);
      } else {
        setStatus(FormStatus.Error);
        // const message = `Error: ${response.status}`;
      }
    })();
  }, []);

  // const labelSet = [
  //   config.labelAll ? config.labelAll : "",
  //   state.label ? state.label : "",
  // ];

  const formData = {
    handle: state.handle,
    bio: state.bio,
    link1: state.link1,
    details1: state.details1,
    link2: state.link2,
    details2: state.details2,
    link3: state.link3,
    details3: state.details3,
  };
  const handleSubmit = () => {
    applyForJudge(url, formData);
  };
  return (
    <StaticQuery
      query={wardenListQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });
        fields[0].options = wardens;

        return (
          <DefaultLayout
            bodyClass="judge-application"
            pageTitle="Judge Application | Code4rena"
          >
            <div className="wrapper-main">
              {(status === FormStatus.Unsubmitted ||
                status === FormStatus.Submitting ||
                status === FormStatus.Error) && (
                <>
                  <h1 className="page-header">Judge Application</h1>
                  <form>
                    <Widgets
                      fields={fields}
                      onChange={handleChange}
                      fieldState={state}
                    />{" "}
                    {status === FormStatus.Error && (
                      <div
                        className="error-message"
                        role="alert"
                        aria-atomic="true"
                      >
                        <p>
                          An error occurred; please try again. If you continue
                          to receive this error, let us know in{" "}
                          <a href="https://discord.gg/code4rena">Discord</a>.
                          All fields are required.
                        </p>
                      </div>
                    )}
                    <button
                      className="button cta-button"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Apply to be a Judge
                    </button>
                  </form>
                </>
              )}

              {status === FormStatus.Submitted && (
                <div className="thank-you">
                  <h1>Thanks for applying!</h1>
                  <p>
                    <strong>Here's what happens next:</strong>
                  </p>
                  <ol>
                    <li>
                      Judge applications are reviewed by the C4 judge selection
                      committee, which includes top leaderboard wardens and past
                      judges. The committee will review your application and
                      give you a "yes" or "not yet".
                    </li>
                    <li>
                      The review process begins after the application window
                      closes, and we expect it to take about a week, depending
                      on the number of applications the committee receives.
                    </li>
                    <li>
                      You'll be contacted via DM to let you know if your
                      application has been successful this time around.
                    </li>
                    <li>
                      If you're accepted as a judge, an organizer will onboard
                      you and get you set up to judge your first contest!
                    </li>
                  </ol>
                  <p>
                    In the meantime, if you have questions, feel free to reach
                    out to us in the C4 Discord, or have a closer look at the{" "}
                    <a href="https://docs.code4rena.com/roles/judges/how-to-judge-a-contest">
                      How to judge a contest
                    </a>{" "}
                    section in the Code4rena docs.
                  </p>
                </div>
              )}
            </div>
          </DefaultLayout>
        );
      }}
    />
  );
};

export default JudgeApplication;
