import { navigate } from "gatsby";
import Moralis from "moralis-v1/types";
import React, {
  useCallback,
  useState,
  useRef,
  ReactNode,
  useEffect,
  PropsWithChildren,
} from "react";
import Avatar from "react-avatar";
import { useMoralis } from "react-moralis";

// types
import { TeamCreateRequest } from "../../types/user";

// hooks
import useUser from "../hooks/UserContext";

// components
import Form from "./form/Form";
import { Input } from "./Input";
import WardenField, { WardenFieldOption } from "./reporter/widgets/WardenField";

export interface TeamState {
  teamName: string;
  polygonAddress: string;
  ethereumAddress: string;
  link?: string;
  avatarFile?: File | undefined;
  teamImage?: string;
}

interface TeamFormProps extends PropsWithChildren {
  handles: Set<string>;
  wardens: WardenFieldOption[];
  initialState?: TeamState;
  initialTeamMembers?: WardenFieldOption[];
  submitButtonText: string;
  successMessage: string | ReactNode;
  onSubmit: (data: TeamCreateRequest, user: Moralis.User) => Promise<Response>;
}

const defaultInitialState: TeamState = {
  teamName: "",
  polygonAddress: "",
  ethereumAddress: "",
  link: "",
  avatarFile: undefined,
  teamImage: "",
};

export default function TeamForm({
  handles,
  wardens,
  initialState,
  initialTeamMembers,
  submitButtonText,
  successMessage,
  onSubmit,
  children,
}: TeamFormProps) {
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const [fileReader] = useState<FileReader>(new FileReader());
  const [state, setState] = useState(defaultInitialState);
  const [submitted, setSubmitted] = useState(false);
  const [teamMembers, setTeamMembers] = useState<WardenFieldOption[]>([
    wardens.find((warden) => warden.value === currentUser.username)!,
  ]);
  const avatarInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (initialState) {
      setState(initialState);
    }
    if (initialTeamMembers) {
      setTeamMembers(initialTeamMembers);
    }
  }, [initialTeamMembers, initialState]);

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
    setState((prevState) => ({ ...prevState, teamImage: res as string }));
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
        teamImage: initialState?.teamImage,
      };
    });
  };

  const throwErrorMessage = (message: string | undefined): void => {
    if (!message) {
      throw "";
    } else if (message === "Reference already exists") {
      if (!initialState) {
        throw (
          "It looks like a team or warden with this name has a " +
          "pending registration. If you already submitted a registration " +
          "for this team, please wait for our team to review and approve " +
          "your request. Otherwise, try choosing a different name."
        );
      } else {
        throw (
          "It looks like there is already a pending request to edit this team. " +
          "Check your email for a link to the PR on GitHub."
        );
      }
    } else {
      throw message;
    }
  };

  const validator = useCallback(() => {
    setSubmitted(true);
    if (
      !state.teamName ||
      teamMembers.length < 2 ||
      (state.teamName !== initialState?.teamName &&
        handles.has(state.teamName)) ||
      // @todo: better validation for addresses
      state.polygonAddress.length !== 42 ||
      (state.ethereumAddress && state.ethereumAddress.length !== 42) ||
      state.teamName.match(/^[0-9a-zA-Z_\-]+$/) === null
    ) {
      return true;
    }
    return false;
  }, [state, teamMembers, handles, currentUser, initialState]);

  const submit = useCallback(async (): Promise<void> => {
    if (!currentUser.isLoggedIn || !user || !isInitialized) {
      navigate("/");
      return;
    }
    const members = teamMembers.map((member) => member.value);

    const requestBody: TeamCreateRequest = {
      teamName: state.teamName,
      members,
      polygonAddress: state.polygonAddress,
      ethereumAddress: state.ethereumAddress,
    };

    if (state.avatarFile && state.teamImage) {
      requestBody.image = state.teamImage.substring(
        state.teamImage.indexOf(",") + 1
      );
    }

    if (state.link) {
      requestBody.link = state.link;
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
    teamMembers,
    handles,
    user,
    isInitialized,
    onSubmit,
  ]);

  const validateTeamName = useCallback(
    (teamName: string): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      const handleNames: string[] = Array.from(handles.values());
      const existingHandle = handleNames.find((handle) => {
        return handle.toLowerCase() === teamName.toLowerCase();
      });
      if (teamName.match(/^[0-9a-zA-Z_\-]+$/) === null) {
        errors.push(
          "Supports alphanumeric characters, underscores, and hyphens"
        );
      }
      if (!initialState && existingHandle) {
        errors.push(
          `${teamName} is already registered as a team, bot, or warden.`
        );
      }
      return errors;
    },
    [handles, initialState]
  );

  const validateTeamMembers = useCallback(
    (members): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      if (members.length < 2) {
        errors.push("You must have at least 2 members on a team.");
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

  return (
    <Form
      successMessage={successMessage}
      onSubmit={submit}
      submitButtonText={submitButtonText}
      validator={validator}
    >
      <>
        {(!initialState || !initialState.teamName) && (
          <Input
            forceValidation={submitted === true}
            name="teamName"
            placeholder="TeamName"
            value={state.teamName}
            required={true}
            label="Team Name"
            helpText="Used to report findings, as well as display your total award amount on the leaderboard. Supports alphanumeric characters, underscores, and hyphens. Maximum 25 characters."
            handleChange={handleChange}
            validator={validateTeamName}
          />
        )}
        <WardenField
          name="teamMembers"
          required={true}
          options={wardens}
          onChange={(e) => {
            setTeamMembers((e.target.value as WardenFieldOption[]) || []);
          }}
          fieldState={teamMembers}
          isMulti={true}
          validator={validateTeamMembers}
          label="Members"
        />
        <Input
          forceValidation={submitted === true}
          name="polygonAddress"
          placeholder="0x00000..."
          value={state.polygonAddress}
          required={true}
          label="Polygon Address"
          helpText="Address where your team's prize should go."
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
        <Input
          forceValidation={submitted === true}
          name="link"
          placeholder="https://twitter.com/code4rena"
          value={state.link || ""}
          label="Link"
          helpText="Link your leaderboard entry to a personal website or social media account."
          handleChange={handleChange}
        />

        <div className="widget__container">
          <label htmlFor="avatar">Avatar (Optional)</label>
          <p className="form__help-text">
            An avatar displayed next to your name on the leaderboard.
          </p>
          <Avatar
            src={state.teamImage}
            name={state.teamName}
            size="50px"
            round="50px"
          />
          <input
            className="widget__avatar"
            type="file"
            id="avatar"
            name="avatar"
            accept=".png,.jpg,.jpeg"
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
        {children}
      </>
    </Form>
  );
}
