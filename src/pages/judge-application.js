import React, { useCallback, useState, useRef } from "react";
import { StaticQuery, graphql } from "gatsby";
import { omit, find } from "lodash";
import clsx from "clsx";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import DefaultLayout from "../layouts/DefaultLayout";
import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";
import { Widgets } from "../components/reporter/widgets";

const config = {
  labelAll: "candidate",
  fields: [
    {
      name: "handle",
      label: "Handle",
      helptext: "Handle you're competing under",
      widget: "warden",
      required: true,
      options: [],
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

const initialState = {
  handle: "",
  details: "",
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
  const [state, setState] = useState({
    handle: "",
    details: "",
  });
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
        console.log("nope");

        setStatus(FormStatus.Error);
        const message = `Error: ${response.status}`;
        console.log(message);
      }
    })();
  }, []);

  // what is this
  const bodyFields = omit(
    state,
    "title",
    "status",
    "label",
    "email",
    "address"
  );

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

  const formData = {
    handle: state.handle,
    details: state.details,
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
            pageTitle="Judge Application | Code 423n4"
          >
            <div className="wrapper-main">
              <h1 className="page-header">Judge Application</h1>
              <form>
                <Widgets
                  fields={fields}
                  onChange={handleChange}
                  fieldState={state}
                />
                <button
                  className="button cta-button"
                  type="button"
                  onClick={handleSubmit}
                >
                  Apply for Judge
                </button>
              </form>
            </div>
          </DefaultLayout>
        );
      }}
    />
  );
};

export default JudgeApplication;
