import { navigate } from "gatsby";
import React, { useCallback, useState, useRef } from "react";
import { useMoralis } from "react-moralis";

// hooks
import useUser from "../hooks/UserContext";

// components
import Form from "./form/Form";
import { Input } from "./Input";
import WardenField from "../components/reporter/widgets/WardenField";

// styles
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";

interface teamState {
  teamName: string;
  polygonAddress: string;
  link?: string;
  avatar?: File | null;
}

interface TeamRegistrationFormProps {
  handles: Set<string>;
  wardens: { value: string; image: unknown }[];
}

const initialState: teamState = {
  teamName: "",
  link: "",
  avatar: null,
  polygonAddress: "",
};

function getFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const data = dataUrl.substr(dataUrl.indexOf(",") + 1);
      resolve(data);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function TeamRegistrationForm({
  handles,
  wardens,
}: TeamRegistrationFormProps) {
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const [state, setState] = useState(initialState);
  const [teamMembers, setTeamMembers] = useState<
    { value: string; image: unknown }[]
  >([wardens.find((warden) => warden.value === currentUser.username)]);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length < 1) {
      setState((prevState) => {
        return { ...prevState, avatar: null };
      });
      return;
    }
    const file = e.target.files[0];
    setState((prevState) => {
      return { ...prevState, avatar: file };
    });
  };

  const removeAvatar = (): void => {
    if (!avatarInputRef || !avatarInputRef.current) {
      return;
    }
    avatarInputRef.current.value = "";
    setState((prevState) => {
      return { ...prevState, avatar: null };
    });
  };

  const throwErrorMessage = (message: string | undefined): void => {
    if (!message) {
      throw "";
    } else if (message === "Reference already exists") {
      throw (
        "It looks like a team or warden with this name has a " +
        "pending registration. If you already submitted a registration " +
        "for this team, please wait for our team to review and approve " +
        "your request. Otherwise, try choosing a different name."
      );
    } else {
      throw message;
    }
  };

  const validator = useCallback(() => {
    if (
      !state.teamName ||
      teamMembers.length < 2 ||
      handles.has(state.teamName) ||
      !teamMembers.find((member) => member.value === currentUser.username) ||
      // @todo: better validation for polygon address
      state.polygonAddress.length !== 42 ||
      state.teamName.match(/^[0-9a-zA-Z_\-]+$/) === null
    ) {
      return true;
    }
    return false;
  }, [state, teamMembers, handles, currentUser]);

  const submitRegistration = useCallback(async (): Promise<void> => {
    const url = `/.netlify/functions/register-team`;
    if (!currentUser.isLoggedIn || !user || !isInitialized) {
      navigate("/");
    }

    let image = undefined;
    const members = teamMembers.map((member) => member.value);

    if (state.avatar) {
      image = await getFileAsBase64(state.avatar);
    }

    const requestBody = {
      teamName: state.teamName,
      username: currentUser.username,
      members,
      link: state.link,
      image,
      address: state.polygonAddress,
    };

    const sessionToken = user.attributes.sessionToken;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestBody),
    });

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
  ]);

  const validateTeamName = useCallback(
    (teamName: string): string[] => {
      const errors = [];
      if (teamName.match(/^[0-9a-zA-Z_\-]+$/) === null) {
        errors.push(
          "Supports alphanumeric characters, underscores, and hyphens"
        );
      }
      if (handles.has(teamName)) {
        errors.push(`${teamName} is already registered as a team or warden.`);
      }
      return errors;
    },
    [handles]
  );

  const validateTeamMembers = useCallback(
    (members: { value: string; image: string }[]): string[] => {
      const errors = [];
      if (members.length < 2) {
        errors.push("You must have at least 2 members on a team.");
      }
      if (!members.find((member) => member.value === currentUser.username)) {
        errors.push("You must add yourself to the team you are creating.");
      }
      return errors;
    },
    [currentUser]
  );

  const validatePolygonAddress = (address: string): string[] => {
    const errors = [];
    if (address.length !== 42) {
      errors.push("Polygon address must be 42 characters long.");
    }
    return errors;
  };

  return (
    <Form
      successMessage="Your registration application has been submitted."
      onSubmit={submitRegistration}
      submitButtonText="Register Team"
      validator={validator}
    >
      <>
        <Input
          name="teamName"
          placeholder="TeamName"
          value={state.teamName}
          required={true}
          label="Team Name *"
          helpText="Used to report findings, as well as display your total award amount on the leaderboard. Supports alphanumeric characters, underscores, and hyphens. Maximum 25 characters."
          handleChange={handleChange}
          validator={validateTeamName}
        />
        {/* @todo: make current user a fixed option */}
        <WardenField
          name="teamMembers"
          required={true}
          options={wardens}
          onChange={(e) => {
            setTeamMembers(e.target.value || []);
          }}
          fieldState={teamMembers}
          isMulti={true}
          validator={validateTeamMembers}
          label="Members *"
        />
        <Input
          name="polygonAddress"
          placeholder="0x00000..."
          value={state.polygonAddress}
          required={true}
          label="Polygon Address *"
          helpText="Address where your team's prize should go. If you use a smart contract wallet, please contact one of our organizers in Discord in addition to adding the address here."
          handleChange={handleChange}
          validator={validatePolygonAddress}
        />
        <Input
          name="link"
          placeholder="https://twitter.com/code4rena"
          value={state.link}
          label="Link (Optional)"
          helpText="Link your leaderboard entry to a personal website or social media account."
          handleChange={handleChange}
        />

        <div className={widgetStyles.Container}>
          <label htmlFor="avatar" className={widgetStyles.Label}>
            Avatar (Optional)
          </label>
          <p className={widgetStyles.Help}>
            An avatar displayed next to your name on the leaderboard.
          </p>
          <input
            className={widgetStyles.Avatar}
            type="file"
            id="avatar"
            name="avatar"
            accept=".png,.jpg,.jpeg,.webp"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
          />
          {state.avatar && (
            <button
              className="remove-line-button"
              type="button"
              onClick={removeAvatar}
              aria-label="Remove avatar"
            >
              &#x2715;
            </button>
          )}
        </div>
      </>
    </Form>
  );
}
