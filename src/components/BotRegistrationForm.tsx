import { navigate } from "gatsby";
import React, {
  useCallback,
  useState,
  useRef,
  ReactNode,
  PropsWithChildren,
} from "react";
import Avatar from "react-avatar";
import { useMoralis } from "react-moralis";

// types
import { BotCreateRequest, BotPromotionRequest } from "../../types/user";

// hooks
import useUser from "../hooks/UserContext";

// components
import Form from "./form/Form";
import { Input } from "./Input";
import { TextArea } from "./reporter/widgets";
import FormField from "./reporter/widgets/FormField";
import WardenField, { WardenFieldOption } from "./reporter/widgets/WardenField";

export interface BotState {
  botName: string;
  description: string;
  submission: string;
  polygonAddress: string;
  ethereumAddress: string;
  avatarFile?: File | undefined;
  botImage?: string;
}

const initialState: BotState = {
  botName: "",
  description: "",
  submission: "",
  polygonAddress: "",
  ethereumAddress: "",
  avatarFile: undefined,
  botImage: "",
};

interface BotRegistrationProps extends PropsWithChildren {
  handles: Set<string>; // includes teams, wardens, and other bots
  wardens: WardenFieldOption[]; // only contains individual wardens; not teams or bots
}

export default function BotRegistrationForm({
  handles,
  wardens,
  children,
}: BotRegistrationProps) {
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const [fileReader] = useState<FileReader>(new FileReader());
  const [state, setState] = useState(initialState);
  const [crew, setCrew] = useState<WardenFieldOption[]>([
    wardens.find((warden) => warden.value === currentUser.username)!,
  ]);
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
    if (currentUser.bot && currentUser.bot.relegated) {
      return !state.submission;
    }
    const validationErrors = [
      ...validateCrew(crew),
      ...validateAddress(state.polygonAddress),
      ...validateBotName(state.botName),
    ];

    if (
      !state.botName ||
      !state.description ||
      !state.submission ||
      !state.polygonAddress ||
      validationErrors.length
    ) {
      return true;
    }
    return false;
  }, [state, handles, currentUser, initialState]);

  const validateCrew = useCallback(
    (crewMembers): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      if (
        !crewMembers.find((member) => member.value === currentUser.username)
      ) {
        errors.push("You must be listed on the crew for any bot you register");
      }
      return errors;
    },
    [currentUser]
  );

  const validateAddress = (address: string): (string | ReactNode)[] => {
    const errors: (string | ReactNode)[] = [];
    if (address && address.length !== 42) {
      errors.push("Wallet address must be 42 characters long.");
    }
    return errors;
  };

  const validateBotName = useCallback(
    (botName: string): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      const handleNames: string[] = Array.from(handles.values());
      const existingHandle = handleNames.find((handle) => {
        return handle.toLowerCase() === botName.toLowerCase();
      });
      if (botName.match(/^[0-9a-zA-Z_\-]+$/) === null) {
        errors.push(
          "Supports alphanumeric characters, underscores, and hyphens"
        );
      }
      if (existingHandle) {
        errors.push(
          `${botName} is already registered as a team, bot, or warden.`
        );
      }
      return errors;
    },
    [handles, initialState]
  );

  const registerBot = useCallback(
    async (sessionToken: string): Promise<void> => {
      const requestBody: BotCreateRequest = {
        botName: state.botName,
        description: state.description,
        submission: state.submission,
        crewMembers: crew.map((member) => member.value),
        polygonAddress: state.polygonAddress,
        ethereumAddress: state.ethereumAddress,
      };

      if (state.avatarFile && state.botImage) {
        requestBody.image = state.botImage.substring(
          state.botImage.indexOf(",") + 1
        );
      }

      const response = await fetch("/.netlify/functions/register-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
      setSubmitted(false);

      if (!response.ok) {
        const res = await response.json();
        throw throwErrorMessage(res.error || "");
      }
    },
    [avatarInputRef, state, crew, currentUser]
  );

  const promoteBot = useCallback(
    async (sessionToken: string): Promise<void> => {
      const requestBody: BotPromotionRequest = {
        botName: currentUser.bot!.username,
        submission: state.submission,
      };

      const response = await fetch("/.netlify/functions/promote-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
      setSubmitted(false);

      if (!response.ok) {
        const res = await response.json();
        throw throwErrorMessage(res.error || "");
      }
    },
    [state, currentUser]
  );

  const submit = useCallback(async (): Promise<void> => {
    if (!currentUser.isLoggedIn || !isInitialized || !user) {
      navigate("/");
      return;
    }

    const sessionToken = user.attributes.sessionToken;

    if (!currentUser.bot) {
      await registerBot(sessionToken);
    } else if (currentUser.bot.relegated) {
      await promoteBot(sessionToken);
    } else throw "You cannot register more than one bot";
  }, [avatarInputRef, state, crew, currentUser, isInitialized]);

  return (
    <Form
      successMessage={
        currentUser.bot && currentUser.bot.relegated
          ? "Your submission was received."
          : "Your bot registration application has been submitted."
      }
      onSubmit={submit}
      submitButtonText={
        currentUser.bot && currentUser.bot.relegated ? "Submit" : "Register Bot"
      }
      validator={validator}
      title={
        currentUser.bot && currentUser.bot.relegated
          ? "Apply for promotion"
          : "Register your Bot"
      }
    >
      {children}
      {!currentUser.bot && (
        <>
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
          <WardenField
            name="crew"
            required={true}
            options={wardens}
            onChange={(e) => {
              setCrew((e.target.value as WardenFieldOption[]) || []);
            }}
            fieldState={crew}
            isMulti={true}
            validator={validateCrew}
            label="Bot Crew"
            helpText="The warden(s) who control and maintain the bot"
          />
          <Input
            forceValidation={submitted === true}
            name="polygonAddress"
            placeholder="0x00000..."
            value={state.polygonAddress}
            required={true}
            label="Polygon Address"
            helpText="Address where your bot's prize should go"
            handleChange={handleChange}
            validator={validateAddress}
            maxLength={42}
          />
          <Input
            forceValidation={submitted === true}
            name="ethereumAddress"
            placeholder="0x00000..."
            value={state.ethereumAddress}
            label="Ethereum Address"
            helpText="Address where we can send ethereum for contests that are awarded in eth"
            handleChange={handleChange}
            validator={validateAddress}
            maxLength={42}
          />
          <FormField
            name="description"
            label="Description"
            helpText="Describe your bot. Cite any open source tools that you use."
            isInvalid={submitted && !state.description}
            required={true}
          >
            <TextArea
              name="description"
              required={true}
              onChange={handleChange}
              fieldState={state.description}
              isInvalid={submitted && !state.description}
            />
          </FormField>
        </>
      )}
      {(!currentUser.bot || currentUser.bot.relegated) && (
        <FormField
          name="submission"
          label="Submission"
          helpText="Enter the output from your bot."
          isInvalid={submitted && !state.submission}
          required={true}
        >
          <TextArea
            name="submission"
            required={true}
            onChange={handleChange}
            fieldState={state.submission}
            isInvalid={submitted && !state.submission}
          />
        </FormField>
      )}
      {!currentUser.bot && (
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
      )}

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
