import React, { useCallback, useEffect, useState } from "react";
import Form from "../form/Form";
import { Input } from "../Input";
import { AbsoluteURL, ContestNumber } from "../../../types/shared";
import { MitigationReviewSubmissionState } from "../../templates/ReportForm";
import { FindingCreateRequest, MitigationStatus } from "../../../types/finding";
import SelectField from "./widgets/SelectField";
import LinksToCode from "./LinksToCodeInput";
import TextArea from "./widgets/TextArea";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import {
  getCurrentStateFromStorage,
  setStateInLocalStorage,
} from "./findings/functions";
import useUser from "../../hooks/UserContext";
import { Link, navigate } from "gatsby";
import { toast } from "react-toastify";
import { issueTypeListField } from "./findings/fields";

interface MitigationReviewSubmissionFormProps {
  sponsor: string;
  contest: ContestNumber;
  contestPath: string;
  repo: string;
  title: string;
  initialState: MitigationReviewSubmissionState;
  onSubmit: (data: FindingCreateRequest) => Promise<Response>;
  findingId: string;
  submitButtonText: string;
  successMessage: string;
}

export default function MitigationReviewSubmissionForm({
  sponsor,
  contest,
  contestPath,
  repo,
  title,
  initialState,
  onSubmit,
  findingId,
  submitButtonText,
  successMessage,
}: MitigationReviewSubmissionFormProps) {
  const mitigationStatusOptions = [
    {
      value: MitigationStatus.MitigationConfirmed,
      label: "Mitigation Confirmed",
    },
    {
      value: MitigationStatus.Unmitigated,
      label: "Unmitigated",
    },
    {
      value: MitigationStatus.New,
      label: "New",
    },
  ];

  const [state, setState] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    const currentState = getCurrentStateFromStorage(findingId, initialState);
    setState(currentState);
  }, [findingId, initialState]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const { name, value } = e.target;
      setState((prevState) => {
        const newState = {
          ...prevState,
          [name]: value,
        };
        setStateInLocalStorage(findingId, newState);
        return newState;
      });
    },
    [state]
  );

  const handleCodeReferencesChange = useCallback(
    (codeReferences: AbsoluteURL[]) => {
      setState((prevState) => {
        const newState = { ...prevState, linksToCode: codeReferences };
        setStateInLocalStorage(findingId, newState);
        return newState;
      });
    },
    [state]
  );

  const submit = async () => {
    const title =
      state.mitigationStatus === MitigationStatus.New
        ? state.title
        : `${state.mitigationOf} ${MitigationStatus[state.mitigationStatus]}`;
    const linksToCodeString = state.linksToCode.join("\n");
    const markdownBody = `# Lines of code\n\n${linksToCodeString}\n\n\n# Vulnerability details\n\n${
      state.details
    }${state.issueType ? `\n\n\n## Assessed type\n\n${state.issueType}` : ""}`;
    const labels: string[] = [];
    if (state.mitigationOf) {
      labels.push(`MR-${state.mitigationOf}`);
    }

    switch (state.mitigationStatus) {
      case MitigationStatus.New:
        labels.push("bug", state.risk);
        break;
      case MitigationStatus.MitigationConfirmed:
        labels.push("mitigation-confirmed");
        break;
      case MitigationStatus.Unmitigated:
        labels.push("unmitigated", state.risk, "bug");
        break;
    }

    const data: FindingCreateRequest = {
      user: currentUser.username,
      contest,
      sponsor,
      repo: repo.split("/").pop() || "",
      emailAddresses: [currentUser.emailAddress],
      attributedTo: currentUser.username,
      risk: state.risk,
      title,
      body: markdownBody,
      labels,
    };

    if (state.mitigationOf) {
      data.mitigationOf = state.mitigationOf;
    }

    const response = await onSubmit(data);
    if (response.ok) {
      if (typeof window !== `undefined`) {
        window.localStorage.removeItem(findingId);
        // clear location state
        navigate("", { state: {} });
      }
    } else {
      const res = await response.text();
      if (res.startsWith("Timeout")) {
        throw (
          "Your request timed out. However, this does not necessarily " +
          "mean your finding was not submitted. Please check the findings " +
          "tab on the contest page. If you don't see your submission there, " +
          "then please try again."
        );
      } else {
        const { error } = JSON.parse(res);
        if (error.startsWith("Failed to send confirmation email")) {
          if (typeof window !== `undefined`) {
            window.localStorage.removeItem(findingId);
          }
          toast.error(error);
        } else {
          throw error;
        }
      }
    }
  };

  const validator = useCallback(() => {
    setIsSubmitted(true);
    const requiredFields = [state.details];
    switch (state.mitigationStatus) {
      case MitigationStatus.MitigationConfirmed:
        requiredFields.push(state.mitigationOf);
        break;
      case MitigationStatus.Unmitigated:
        requiredFields.push(state.mitigationOf, state.risk);
        break;
      case MitigationStatus.New:
        const linksToCodeRegex = new RegExp("#L[0-9]+(-L[0-9]+)?$");
        const hasInvalidLinks = state.linksToCode.some((link) => {
          return !linksToCodeRegex.test(link);
        });
        if (hasInvalidLinks || !state.linksToCode[0]) {
          return true;
        }
        requiredFields.push(state.risk, state.issueType);
        break;
    }
    return requiredFields.some((field) => {
      return field === "" || field === undefined;
    });
  }, [state]);

  const resetForm = useCallback(() => {
    setState(initialState);
    setIsSubmitted(false);
  }, [initialState, state, isSubmitted]);

  return (
    <Form
      validator={validator}
      successMessage={
        <>
          <p>{successMessage}</p>
          <br />
          <Link to={contestPath} className="button button--secondary">
            Back to Contest
          </Link>
        </>
      }
      successButtonText="Submit another"
      onSubmit={submit}
      submitButtonText={submitButtonText}
      className="limited-width submit-findings"
      title={`Mitigation Review for ${sponsor}`}
      resetForm={resetForm}
    >
      <fieldset className="form-field">
        <label>Mitigation status *</label>
        <p className="form-field__help-text">
          <strong>Mitigation Confirmed:</strong>
          &nbsp;the original vulnerability was successfully mitigated, and the
          mitigation did not create any new issues
          <br />
          <strong>Unmitigated:</strong>
          &nbsp;the attempted mitigation for the original issue was not fully
          successful
          <br />
          <strong>New:</strong>
          &nbsp;
          {"a new vulnerability or bug was found - either missed in" +
            " previous audit(s) or caused by an attempted mitigation"}
        </p>
        <SelectField
          name="mitigationStatus"
          options={mitigationStatusOptions}
          onChange={handleChange}
          fieldState={state.mitigationStatus}
          required={true}
        />
      </fieldset>
      <Input
        name="mitigationOf"
        required={
          state.mitigationStatus === MitigationStatus.MitigationConfirmed ||
          state.mitigationStatus === MitigationStatus.Unmitigated
        }
        label={
          state.mitigationStatus === MitigationStatus.New
            ? "Report ID of original finding (if relevant)"
            : "Report ID of original finding"
        }
        placeholder="H-01"
        value={state.mitigationOf}
        handleChange={handleChange}
        forceValidation={isSubmitted}
      />
      {state.mitigationStatus !== MitigationStatus.MitigationConfirmed && (
        <fieldset className="form-field">
          <label>Risk rating *</label>
          <SelectField
            name="risk"
            fieldState={state.risk}
            onChange={handleChange}
            required={true}
            options={[
              {
                label: "Low / Non-critical)",
                value: "QA (Quality Assurance)",
              },
              {
                label: "Medium Risk",
                value: "2 (Med Risk)",
              },
              {
                label: "High Risk",
                value: "3 (High Risk)",
              },
            ]}
          />
        </fieldset>
      )}
      {state.mitigationStatus === MitigationStatus.New && (
        <Input
          name="title"
          value={state.title}
          required={true}
          handleChange={handleChange}
          label="Title"
          helpText="Summarize your findings for the bug or vulnerability. (This will be the issue title)"
          forceValidation={isSubmitted}
        />
      )}
      {state.mitigationStatus !== MitigationStatus.MitigationConfirmed && (
        <LinksToCode
          onChange={handleCodeReferencesChange}
          linksToCode={state.linksToCode}
          required={state.mitigationStatus === MitigationStatus.New}
        />
      )}
      <fieldset className="form-field">
        <label>
          {state.mitigationStatus === MitigationStatus.MitigationConfirmed
            ? "Details *"
            : "Vulnerability Details *"}
        </label>
        <ReactMarkdown className={"form-field__help-text"}>
          {"Link to all referenced sections of code in GitHub. \n You can use " +
            "[markdown](https://www.markdownguide.org/basic-syntax/) including " +
            "[markdown math notation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions) " +
            "in this field"}
        </ReactMarkdown>
        <TextArea
          name="details"
          required={true}
          isInvalid={!state.details && isSubmitted}
          fieldState={state.details}
          onChange={handleChange}
        />
        {!state.details && isSubmitted && (
          <div className={"form-field__error"}>This field is required</div>
        )}
      </fieldset>
      {state.mitigationStatus !== MitigationStatus.MitigationConfirmed && (
        <fieldset className="form-field">
          <label>
            {state.mitigationStatus === MitigationStatus.New
              ? "Issue type *"
              : "Issue type (Optional)"}
          </label>
          <SelectField
            name={issueTypeListField.name}
            options={issueTypeListField.options}
            required={state.mitigationStatus === MitigationStatus.New}
            onChange={handleChange}
            fieldState={state.issueType}
            isInvalid={
              isSubmitted &&
              !state.issueType &&
              state.mitigationStatus === MitigationStatus.New
            }
          />
        </fieldset>
      )}
    </Form>
  );
}
