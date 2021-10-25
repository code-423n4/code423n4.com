import React, { useCallback, useState } from "react";
import { omit, find } from "lodash";
import { StaticQuery, graphql } from "gatsby";
import clsx from "clsx";
import { Widgets } from "./widgets";
import * as styles from "./Form.module.scss";
import Agreement from "../content/Agreement.js";

const config = {
  labelAll: "bug",
  fields: [
    {
      name: "handle",
      label: "Handle",
      helptext: "Handle you're competing under (individual or team name)",
      widget: "warden",
      required: true,
      options: [],
    },
    {
      name: "email",
      label: "Email address",
      helptext: "Used to send a copy of this form for your records",
      widget: "text",
      required: true,
    },
    {
      name: "address",
      label: "Eth address",
      helptext:
        "Address where your prize should go to (and retroactive token reward should C4 be tokenized later)",
      widget: "text",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      helptext:
        "Summarize your findings for the bug or vulnerability. (This will be the issue title.)",
      widget: "text",
      required: true,
    },
    {
      name: "label",
      label: "Risk rating",
      widget: "select",
      required: true,
      options: [
        {
          label: "0 — Gas Optimization",
          value: "G (Gas Optimization)",
        },
        {
          label: "0 — Non-critical",
          value: "0 (Non-critical)",
        },
        {
          label: "1 — Low Risk",
          value: "1 (Low Risk)",
        },
        {
          label: "2 — Medium Risk",
          value: "2 (Med Risk)",
        },
        {
          label: "3 — High Risk",
          value: "3 (High Risk)",
        },
      ],
    },
    {
      name: "details",
      label: "Vulnerability details",
      helptext: "Link to all referenced sections of code in GitHub",
      widget: "textarea",
      required: true,
    },
  ],
};
const mdTemplate =
  "## Impact\nDetailed description of the impact of this finding.\n\n## Proof of Concept\nProvide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.\n\n## Tools Used\n\n## Recommended Mitigation Steps";

const initialState = {
  title: "",
  email: "",
  handle: "",
  address: "",
  details: mdTemplate,
};

const FormStatus = {
  Unsubmitted: "unsubmitted",
  Submitting: "submitting",
  Submitted: "submitted",
  Error: "error",
};

const wardensQuery = graphql`
  query Wardens {
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

const Form = ({ contest, sponsor, repoUrl }) => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState("unsubmitted");

  const fields = config.fields;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);

  const url = `/.netlify/functions/submit-finding`;

  const submitFinding = useCallback((url, data) => {
    (async () => {
      setStatus(FormStatus.Submitting);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus(FormStatus.Submitted);
      } else {
        setStatus(FormStatus.Error);
        const message = `Error: ${response.status}`;
        throw new Error(message);
      }
    })();
  }, []);

  // body contains everything in state except title, label, and status

  // TODO filter out email, eth address, and possibly handle
  // TODO add eth address to data blob
  const bodyFields = omit(
    state,
    "title",
    "status",
    "label",
    "email",
    "address"
  );
  // const bodyFields = omit(state, "title", "status", "label");

  let markdownBody = [];

  Object.keys(bodyFields).forEach((key) => {
    const fieldOpts = find(fields, { name: key });
    const input = bodyFields[key];
    markdownBody.push(`# ${fieldOpts.label}\n\n${input}\n\n`);
  });

  const labelSet = [
    config.labelAll ? config.labelAll : "",
    state.label ? state.label : "",
  ];

  let risk;
  if (state.label) {
    risk = state.label.slice(0, 1);
  }

  const formData = {
    contest,
    sponsor,
    repoUrl,
    email: state.email,
    handle: state.handle,
    address: state.address,
    risk,
    title: state.title,
    body: markdownBody.join("\n"),
    labels: labelSet,
  };

  const handleSubmit = () => {
    submitFinding(url, formData);
  };

  const handleReset = () => {
    setState({
      ...state,
      title: "",
      details: mdTemplate,
    });
    setStatus(FormStatus.Unsubmitted);
  };

  return (
    <StaticQuery
      query={wardensQuery}
      render={(data) => {
        const wardens = data.allHandlesJson.edges.map(({ node }) => {
          return { value: node.handle, image: node.image };
        });
        fields[0].options = wardens;

        return (
          <div className={clsx(styles.Form)}>
            <h1>{sponsor} contest finding</h1>
            {(status === FormStatus.Unsubmitted ||
              status === FormStatus.Submitting) && (
              <form>
                <input
                  type="hidden"
                  id="contest"
                  name="contest"
                  value={contest}
                />
                <Widgets
                  fields={fields}
                  onChange={handleChange}
                  fieldState={state}
                />
                <Agreement />
                <button
                  className="button cta-button centered"
                  type="button"
                  onClick={handleSubmit}
                  disabled={status !== "unsubmitted"}
                >
                  {status === FormStatus.Unsubmitted
                    ? "Create issue"
                    : "Submitting..."}
                </button>
              </form>
            )}
            {status === FormStatus.Error && (
              <div>
                <p>An error occurred</p>
              </div>
            )}
            {status === FormStatus.Submitted && (
              <div>
                <h1>Thank you!</h1>
                <p>Your report has been submitted.</p>
                <button
                  className="button cta-button"
                  type="button"
                  onClick={handleReset}
                >
                  Submit another
                </button>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default Form;
