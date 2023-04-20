import Moralis from "moralis-v1";
import React, { useCallback, useState } from "react";

import { BotReportCreateRequest } from "../../../types/finding";
import useUser from "../../hooks/UserContext";

import Form from "../form/Form";
import { TextArea } from "./widgets";
import FormField from "./widgets/FormField";

export default function SubmitBotFinding({ title, contestNumber }) {
  const { currentUser } = useUser();
  const [botSubmission, setBotSubmission] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validator = useCallback(() => {
    setSubmitted(true);
    if (!botSubmission) {
      return true;
    }
    return false;
  }, [botSubmission]);

  const submit = useCallback(async () => {
    const user = await Moralis.User.current();
    if (!user) {
      throw "You must be logged in to submit or edit findings";
    }

    const requestData: BotReportCreateRequest = {
      contest: contestNumber,
      botName: currentUser.bot.username,
      body: botSubmission,
    };

    const sessionToken = user.attributes.sessionToken;
    const response = await fetch(`/.netlify/functions/submit-bot-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
        "C4-User": currentUser.username,
      },
      body: JSON.stringify(requestData),
    });
    if (response.status !== 201) {
      const { error } = await response.json();
      throw error;
    }
  }, [botSubmission, currentUser]);

  return (
    <Form
      onSubmit={submit}
      title={
        <div className="bot-race__form-title">
          <img src="/images/icon/wolf-bot/32.svg" className="icon" />
          {`${currentUser!.bot!.username}'s Bot Race Report`}
        </div>
      }
      subtitle={`${title} - Audit competition`}
      successMessage="Your report has been submitted."
      validator={validator}
    >
      <FormField
        label="Your bot race report"
        name="botSubmission"
        type="markdown"
        helpText=""
        isInvalid={submitted && !botSubmission}
        required={true}
      >
        <TextArea
          required={true}
          name="botSubmission"
          fieldState={botSubmission}
          isInvalid={submitted && !botSubmission}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBotSubmission(e.target.value)
          }
        />
      </FormField>
      <div className="register-bot__agreement">
        By submitting this form, you agree to:
        <ul>
          <li>
            only use APIs that do not retain sponsor code as part of public data
            sets
          </li>
          <li>
            refrain from sharing your report with non-crew members until reports
            are made public
          </li>
        </ul>
      </div>
    </Form>
  );
}
