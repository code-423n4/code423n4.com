import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import {
  emailField,
  addressField,
  titleField,
  riskField,
  wardenField,
  linesOfCodeField,
  vulnerabilityDetailsField,
  qaGasDetailsField,
} from "../components/reporter/findings/fields";
import { initialState } from "../components/reporter/findings/state";
import {
  initStateFromStorage,
  config,
  checkTitle,
  checkQaOrGasFinding,
} from "../components/reporter/findings/functions";
import Form from "../components/form/Form";

const ReportForm = (props) => {
  const wardens = props.data.allHandlesJson.edges.map(({ node }) => {
    return { value: node.handle, image: node.image };
  });
  const [state, setState] = useState(initialState);
  const [fieldList, setFieldList] = useState([
    wardenField(wardens),
    emailField,
    addressField,
    riskField,
  ]);
  const submissionUrl = `/.netlify/functions/submit-finding`;

  const endTime = props.data.contestsCsv.end_time;
  const hasContestEnded = Date.now() > new Date(endTime).getTime();

  const displayedInfo = {
    title: `${props.data.contestsCsv.sponsor.name} contest finding`,
    buttonText: "Create issue",
    afterSubmit: "Your report has been submitted.",
  };

  useEffect(() => {
    initStateFromStorage(
      props.data.contestsCsv.contestid,
      props.data.contestsCsv.sponsor.name,
      props.data.contestsCsv.findingsRepo,
      setState
    );
  }, [
    props.data.contestsCsv.contestid,
    props.data.contestsCsv.findingsRepo,
    props.data.contestsCsv.sponsor.name,
    initStateFromStorage,
  ]);

  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem(
        props.data.contestsCsv.contestid,
        JSON.stringify(state)
      );
    }
  }, [state, props.data.contestsCsv.contestid]);

  const changeHandler = (e) => {
    if (Array.isArray(e)) {
      setState((state) => {
        return { ...state, linesOfCode: e };
      });
    } else {
      const { name, value } = e?.target;
      switch (name) {
        case "risk":
          setState((state) => {
            return {
              ...state,
              [name]: value,
              labels: [config.labelAll, value ? value : ""],
            };
          });
          break;
        case "title":
          setState((state) => {
            return { ...state, [name]: checkTitle(value, state.risk) };
          });
          break;
        default:
          setState((state) => {
            return { ...state, [name]: value };
          });
          break;
      }
    }
  };

  const handleSubmit = (
    setHasValidationErrors,
    submitFinding,
    setIsExpanded
  ) => {
    const locString = state.linesOfCode.map((loc) => loc.value).join("\n");
    const details = checkQaOrGasFinding(state.risk)
      ? state.qaGasDetails
      : state.details;
    const markdownBody = `# Lines of code\n\n${locString}\n\n\n# Vulnerability details\n\n${details}\n\n`;

    // extract required fields from field data for validation check
    const formatedRisk = state.risk ? state.risk.slice(0, 1) : "";
    const formatedBody = checkQaOrGasFinding(state.risk)
      ? details
      : markdownBody;

    const { email, handle, address, title } = state;
    const requiredFields = checkQaOrGasFinding(state.risk)
      ? [email, handle, address, formatedRisk, formatedBody]
      : [email, handle, address, formatedRisk, title, formatedBody];
    let hasErrors = requiredFields.some((field) => {
      return field === "" || field === undefined;
    });

    // TODO: verify that loc include code lines and are valid URLs
    if (!checkQaOrGasFinding(state.risk) && !state.linesOfCode[0].value) {
      hasErrors = true;
    }

    const regex = new RegExp("#L", "g");
    const hasInvalidLinks = state.linesOfCode.some((line) => {
      return !regex.test(line.value);
    });

    const submitData = {
      contest: props.data.contestsCsv.contestid,
      sponsor: props.data.contestsCsv.sponsor.name,
      repo: props.data.contestsCsv.findingsRepo.split("/").pop(),
      email,
      handle,
      address,
      risk: formatedRisk,
      title: checkTitle(state.title, state.risk),
      body: formatedBody,
      labels: state.labels,
    };

    setHasValidationErrors(hasErrors || hasInvalidLinks);
    if (!hasErrors) {
      submitFinding(submissionUrl, submitData);
      if (typeof window !== `undefined`) {
        window.localStorage.removeItem(props.data.contestsCsv.contestid);
      }

      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (checkQaOrGasFinding(state.risk)) {
      setFieldList([
        wardenField(wardens),
        emailField,
        addressField,
        riskField,
        qaGasDetailsField,
      ]);
    } else {
      setFieldList([
        wardenField(wardens),
        emailField,
        addressField,
        riskField,
        titleField,
        linesOfCodeField,
        vulnerabilityDetailsField,
      ]);
    }
  }, [state.risk]);

  return (
    <main>
      {hasContestEnded ? (
        <div className="center">
          <h1>This contest has ended.</h1>
          <p>You can no longer submit findings for this contest.</p>
          <Link
            to="/contests"
            className="contest-repo button button-small cta-button primary"
          >
            View active contests
          </Link>
        </div>
      ) : (
        <Form
          contest={props.data.contestsCsv.contestid}
          state={state}
          setState={setState}
          initialState={initialState}
          fieldsList={fieldList}
          handleSubmit={handleSubmit}
          changeHandler={changeHandler}
          checkQaOrGasFinding={checkQaOrGasFinding}
          displayedInfo={displayedInfo}
        />
      )}
    </main>
  );
};

export default ReportForm;

export const pageQuery = graphql`
  query ContestsById($contestId: Int) {
    contestsCsv(contestid: { eq: $contestId }) {
      title
      contestid
      start_time
      end_time
      findingsRepo
      sponsor {
        name
      }
    }
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
