import { graphql, navigate } from "gatsby";
import isEqual from "lodash/isEqual";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useMoralis } from "react-moralis";

//types
import { BotData, BotUpdateRequest } from "../../types/user";

// hooks
import useUser, { BotInfo } from "../hooks/UserContext";

// components
import WardenField, {
  WardenFieldOption,
} from "../components/reporter/widgets/WardenField";
import Form from "../components/form/Form";
import { Input } from "../components/Input";
import Avatar from "react-avatar";

interface BotState {
  botName: string;
  polygonAddress: string;
  ethereumAddress?: string;
  relegated: boolean;
  avatarFile?: File | undefined;
  botImage?: string;
}

const initialState: BotState = {
  botName: "",
  polygonAddress: "",
  ethereumAddress: undefined,
  relegated: false,
  avatarFile: undefined,
  botImage: "",
};

export default function BotManagementForm({ location, wardens }) {
  const { currentUser } = useUser();
  const { user, isInitialized } = useMoralis();

  const [fileReader] = useState<FileReader>(new FileReader());
  const [unauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [botState, setBotState] = useState<BotState>(initialState);
  const [crewMembers, setCrewMembers] = useState<WardenFieldOption[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    (async () => {
      if (location.state && location.state.bot) {
        const bot: BotInfo = location.state.bot;
        initializeState(bot);
      } else if (!location.search) {
        return;
      }
      const params = new URLSearchParams(location.search);
      const botName = params.get("bot");
      if (!botName) {
        return;
      }
      const botResponse = await fetch(
        `/.netlify/functions/get-bot?id=${currentUser.username}`
      );
      if (botResponse.status === 200) {
        const botData: BotData = await botResponse.json();
        const polygonAddress =
          botData.paymentAddresses &&
          botData.paymentAddresses.find(
            (address) => address.chain === "polygon"
          );
        const ethereumAddress =
          botData.paymentAddresses &&
          botData.paymentAddresses.find(
            (address) => address.chain === "ethereum"
          );
        const bot: BotInfo = {
          username: botData.handle,
          image: botData.imageUrl,
          relegated: botData.relegated || false,
          polygonAddress: polygonAddress?.address || "",
          ethereumAddress: ethereumAddress?.address,
          crew: botData.crew,
        };
        initializeState(bot);
      }
    })();
  }, [location, currentUser]);

  const initializeState = (bot: BotInfo) => {
    if (!bot.crew.includes(currentUser.username)) {
      setIsUnauthorized(true);
      return;
    }
    setIsUnauthorized(false);

    const crewMembers: WardenFieldOption[] = [];
    bot.crew.forEach((m) => {
      const crewMember = wardens.find((warden) => warden.value === m);
      crewMember && crewMembers.push(crewMember);
    });
    setCrewMembers(crewMembers);

    const state: BotState = {
      botName: bot.username,
      polygonAddress: bot.polygonAddress || "",
      ethereumAddress: bot.ethereumAddress || "",
      botImage: bot.image,
      relegated: bot.relegated || false,
    };
    setBotState(state);
  };

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

  const removeAvatar = (): void => {
    if (!avatarInputRef || !avatarInputRef.current) {
      return;
    }
    avatarInputRef.current.value = "";
    setBotState((prevState) => {
      return {
        ...prevState,
        avatarFile: undefined,
        botImage: initialState.botImage,
      };
    });
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length < 1) {
      setBotState((prevState) => {
        return { ...prevState, avatarFile: undefined };
      });
      return;
    }
    const file = e.target.files[0];
    setBotState((prevState) => {
      return { ...prevState, avatarFile: file };
    });
    const res = await getFileAsBase64(file);
    setBotState((prevState) => ({ ...prevState, teamImage: res as string }));
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setBotState((prevState) => {
        return { ...prevState, [name]: value };
      });
    },
    [botState]
  );

  const throwErrorMessage = (message: string | undefined): void => {
    if (!message) {
      throw "";
    } else if (message === "Reference already exists") {
      "It looks like there is already a pending request to edit this team. " +
        "Check your email for a link to the PR on GitHub.";
    } else {
      throw message;
    }
  };

  const validateCrew = useCallback(
    (crew): (string | ReactNode)[] => {
      const errors: (string | ReactNode)[] = [];
      if (crew.length < 1) {
        errors.push("You must have at least 1 crew member to manage a bot");
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

  const validator = useCallback(() => {
    setSubmitted(true);
    const crewErrors = validateCrew(crewMembers);
    const polygonAddressErrors = validateAddress(botState.polygonAddress);
    const ethereumAddressErrors = botState.ethereumAddress
      ? validateAddress(botState.ethereumAddress)
      : [];
    const validationErrors = [
      ...crewErrors,
      ...polygonAddressErrors,
      ...ethereumAddressErrors,
    ];
    if (validationErrors.length) {
      return true;
    }
    return false;
  }, [botState, crewMembers, currentUser]);

  const submit = useCallback(async (): Promise<void> => {
    if (!currentUser.isLoggedIn || !user || !isInitialized) {
      navigate("/");
      return;
    }
    const crew = crewMembers.map((member) => member.value);

    const image = botState.botImage?.substring(
      botState.botImage.indexOf(",") + 1
    );

    const sessionToken = user.attributes.sessionToken;
    if (
      isEqual(currentUser.bot!.crew, crew) &&
      !image &&
      currentUser.bot!.ethereumAddress === botState.ethereumAddress &&
      currentUser.bot!.polygonAddress === botState.polygonAddress
    ) {
      throw "There were no changes to save";
    }

    const requestBody: BotUpdateRequest = {
      botName: botState.botName,
      crew: {
        oldValue: currentUser.bot!.crew,
        newValue: crew,
      },
      polygonAddress: {
        oldValue: currentUser.bot!.polygonAddress,
        newValue: botState.polygonAddress,
      },
    };

    if (botState.ethereumAddress || currentUser.bot!.ethereumAddress) {
      requestBody.ethereumAddress = {
        oldValue: currentUser.bot!.ethereumAddress || "",
        newValue: botState.ethereumAddress || "",
      };
    }

    if (image) {
      requestBody.image = image;
    }

    const response = await fetch("/.netlify/functions/manage-bot", {
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
  }, [avatarInputRef, botState, currentUser, crewMembers, user, isInitialized]);

  return (
    <div className="limited-width">
      {unauthorized ? (
        <div className="centered-text">
          <div className="form">
            <h1>Unauthorized</h1>
            <p>You are not authorized to view or edit this team.</p>
          </div>
        </div>
      ) : (
        <>
          <Form
            title={`Manage Bot "${botState.botName}"`}
            onSubmit={submit}
            submitButtonText="Save bot"
            validator={validator}
            successMessage={
              <p>
                Your changes have been submitted!
                <br />
                <strong>Please note: </strong>it may take a few business days
                for your changes to take effect. You should get an email with a
                link to track the progress of your changes.
              </p>
            }
          >
            <WardenField
              name="crewMembers"
              required={true}
              options={wardens}
              onChange={(e) => {
                setCrewMembers((e.target.value as WardenFieldOption[]) || []);
              }}
              fieldState={crewMembers}
              isMulti={true}
              validator={validateCrew}
              label="Crew"
            />
            <Input
              forceValidation={submitted === true}
              name="polygonAddress"
              placeholder="0x00000..."
              value={botState.polygonAddress}
              required={true}
              label="Polygon Address"
              helpText="Address where your bot's prize should go."
              handleChange={handleChange}
              validator={validateAddress}
              maxLength={42}
            />
            <Input
              forceValidation={submitted === true}
              name="ethereumAddress"
              placeholder="0x00000..."
              value={botState.ethereumAddress || ""}
              label="Ethereum Address"
              helpText="Address where we can send ethereum for contests that are awarded in eth"
              handleChange={handleChange}
              validator={validateAddress}
              maxLength={42}
            />

            <div className="widget__container">
              <label htmlFor="avatar">Avatar (Optional)</label>
              <Avatar
                src={botState.botImage}
                name={botState.botName}
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
              {botState.avatarFile && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  aria-label="Remove avatar"
                >
                  &#x2715;
                </button>
              )}
            </div>
            <p>
              <strong>Heads up!</strong> Changes you make to your team are not
              immediately effective. It may take up a few business days for your
              changes to be reviewed and completed.
            </p>
          </Form>
        </>
      )}
    </div>
  );
}

export const query = graphql`
  query {
    handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
          link
          moralisId
          members {
            handle
          }
          image {
            childImageSharp {
              resize(width: 80) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
