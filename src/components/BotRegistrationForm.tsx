import { navigate } from "gatsby";
import React, { useCallback, useState, useRef, ReactNode } from "react";
import Avatar from "react-avatar";
import { useMoralis } from "react-moralis";

// types
import { BotCreateRequest } from "../../types/user";

// hooks
import useUser from "../hooks/UserContext";

// components
import Form from "./form/Form";
import { Input } from "./Input";
import { TextArea } from "./reporter/widgets";
import FormField from "./reporter/widgets/FormField";
import WardenDetails from "./WardenDetails";

export interface BotState {
  botName: string;
  description: string;
  submission: string;
  owner: string;
  avatarFile?: File | undefined;
  botImage?: string;
}

const initialState: BotState = {
  botName: "",
  description: "",
  submission: "",
  owner: "",
  avatarFile: undefined,
  botImage: "",
};

export default function BotForm({ handles }) {
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const [fileReader] = useState<FileReader>(new FileReader());
  const [state, setState] = useState({
    ...initialState,
    owner: currentUser.username,
  });
  const [submitted, setSubmitted] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setState((prevState) => {
        return { ...prevState, [name]: value };
      });
    },
    [state]
  );

  const getFileAsBase64 = (file) => {
    if (file.type && !file.type.startsWith("image/")) {
      console.log("File is not an image.", file.type, file);
      return;
    }
    return new Promise((resolve, reject) => {
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        const dataUrl = fileReader.result;
        resolve(dataUrl);
      };
      fileReader.onerror = (err) => reject(err);
    });
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length < 1) {
      setState((prevState) => {
        return { ...prevState, avatarFile: undefined };
      });
      return;
    }
    const file = e.target.files[0];
    setState((prevState) => {
      return { ...prevState, avatarFile: file };
    });
    const res = await getFileAsBase64(file);
    setState((prevState) => ({ ...prevState, botImage: res as string }));
  };

  const removeAvatar = (): void => {
    if (!avatarInputRef || !avatarInputRef.current) {
      return;
    }
    avatarInputRef.current.value = "";
    setState((prevState) => {
      return {
        ...prevState,
        avatarFile: undefined,
        botImage: "",
      };
    });
  };

  const throwErrorMessage = (message: string | undefined): void => {
    if (!message) {
      throw "";
    } else if (message === "Reference already exists") {
      throw (
        "It looks like a bot, team, or warden with this name has a " +
        "pending application. If you already submitted a application " +
        "for this bot, please wait for our team to review your request. " +
        "Otherwise, try choosing a different name."
      );
    } else {
      throw message;
    }
  };

  const validator = useCallback(() => {
    setSubmitted(true);
    if (
      !state.botName ||
      !state.description ||
      !state.submission ||
      handles.has(state.botName) ||
      state.botName.match(/^[0-9a-zA-Z_\-]+$/) === null
    ) {
      return true;
    }
    return false;
  }, [state, handles, currentUser, initialState]);

  const onSubmit = useCallback(
    async (requestBody, user) => {
      const sessionToken = user.attributes.sessionToken;

      return await fetch("/.netlify/functions/register-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
    },
    [currentUser]
  );

  const submit = useCallback(async (): Promise<void> => {
    if (!currentUser.isLoggedIn || !user || !isInitialized) {
      navigate("/");
      return;
    }

    const requestBody: BotCreateRequest = {
      botName: state.botName,
      description: state.description,
      submission: state.submission,
      owner: state.owner,
    };

    if (state.avatarFile && state.botImage) {
      requestBody.image = state.botImage.substring(
        state.botImage.indexOf(",") + 1
      );
    }

    const response = await onSubmit(requestBody, user);
    setSubmitted(false);

    if (!response.ok) {
      const res = await response.json();
      throw throwErrorMessage(res.error || "");
    }
  }, [
    avatarInputRef,
    state,
    currentUser,
    handles,
    user,
    isInitialized,
    onSubmit,
  ]);

  const validateBotName = useCallback(
    (botName: string): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      if (botName.match(/^[0-9a-zA-Z_\-]+$/) === null) {
        errors.push(
          "Supports alphanumeric characters, underscores, and hyphens"
        );
      }
      if (handles.has(botName)) {
        errors.push(`${botName} is already registered as a bot or warden.`);
      }
      return errors;
    },
    [handles, initialState]
  );

  function handleOwnerChange(owner) {
    setState((prevState) => {
      return { ...prevState, owner };
    });
  }

  return (
    <Form
      successMessage="Your bot registration application has been submitted."
      onSubmit={submit}
      submitButtonText="Register Bot"
      validator={validator}
    >
      {currentUser.teams.length > 0 && (
        <>
          <h3>Bot Owner</h3>
          <p>Will this bot be run by you or your team?</p>
          <fieldset className="submit-findings__submitting-as">
            <h4>Warden</h4>
            <label className="form__radio">
              <input
                type="radio"
                value={currentUser.username}
                name="currentUser"
                checked={state.owner === currentUser.username}
                onChange={handleOwnerChange}
              />
              <WardenDetails
                username={currentUser.username}
                image={currentUser.image}
              />
            </label>
            <h4>Team</h4>
            {currentUser.teams.map((team, i) => (
              <label key={team.username} className="form__radio">
                <input
                  type="radio"
                  value={i}
                  name="team"
                  checked={state.owner === team.username}
                  onChange={handleOwnerChange}
                />
                <WardenDetails username={team.username} image={team.image} />
              </label>
            ))}
          </fieldset>
        </>
      )}
      <Input
        forceValidation={submitted === true}
        name="botName"
        placeholder="Wardenator"
        value={state.botName}
        required={true}
        label="Bot Name"
        helpText="Supports alphanumeric characters, underscores, and hyphens. Maximum 25 characters."
        handleChange={handleChange}
        validator={validateBotName}
      />
      <FormField
        name="description"
        label="Description"
        helpText="Describe your bot. Cite any open source tools that you use."
        isInvalid={submitted && !state.description}
      >
        <TextArea
          name="description"
          required={true}
          onChange={handleChange}
          fieldState={state.description}
          isInvalid={submitted && !state.description}
        />
      </FormField>
      <FormField
        name="submission"
        label="Submission"
        helpText="Enter the output from your bot."
        isInvalid={submitted && !state.submission}
      >
        <TextArea
          name="submission"
          required={true}
          onChange={handleChange}
          fieldState={state.submission}
          isInvalid={submitted && !state.submission}
        />
      </FormField>
      <div className="widget__container">
        <label htmlFor="avatar">Avatar (Optional)</label>
        <Avatar
          src={state.botImage}
          name={state.botName}
          size="50px"
          round="50px"
        />
        <input
          className="widget__avatar"
          type="file"
          id="avatar"
          name="avatar"
          accept=".png,.jpg,.jpeg,.webp"
          // @ts-ignore // @todo: solve this typescript error
          ref={avatarInputRef}
          onChange={handleAvatarChange}
        />
        {state.avatarFile && (
          <button
            type="button"
            onClick={removeAvatar}
            aria-label="Remove avatar"
          >
            &#x2715;
          </button>
        )}
      </div>
    </Form>
  );
}
