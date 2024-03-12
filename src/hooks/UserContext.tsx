import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MoralisProvider, useMoralis } from "react-moralis";
import Moralis from "moralis-v1";
import { toast } from "react-toastify";
import { navigate } from "gatsby";

// types
import { BotData, TeamData } from "../../types/user";

// hooks
import { ModalProvider, useModalContext } from "./ModalContext";

export enum UserLoginError {
  RegistrationPending = "registration pending",
  ConnectionPending = "connect wallet pending",
  Unregistered = "unregistered",
  Unknown = "",
}

interface UserBasicInfo {
  username: string;
  image?: string | undefined;
  link?: string | undefined;
}

export interface TeamInfo extends UserBasicInfo {
  polygonAddress?: string;
  ethereumAddress?: string;
  members: string[];
}

export interface BotInfo extends UserBasicInfo {
  polygonAddress: string;
  ethereumAddress?: string;
  crew: string[];
  relegated: boolean;
}

interface UserState extends UserBasicInfo {
  discordUsername: string;
  gitHubUsername: string;
  polygonPaymentAddress?: string | undefined;
  emailAddress: string;
  moralisId: string;
  teams: TeamInfo[];
  isLoggedIn: boolean;
  isCertified: boolean;
  bot?: BotInfo;
}

interface User {
  currentUser: UserState;
  logUserOut: () => void;
  connectWallet: () => Promise<void>;
  reFetchUser: () => Promise<void>;
}

const DEFAULT_STATE: UserState = {
  username: "",
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  moralisId: "",
  teams: [],
  isLoggedIn: false,
  image: undefined,
  link: undefined,
  isCertified: false,
  bot: undefined,
};

const UserContext = createContext<User>({
  currentUser: DEFAULT_STATE,
  logUserOut: () => {},
  connectWallet: async () => {},
  reFetchUser: async () => {},
});

const UserProvider = ({ children }) => {
  const { isAuthenticated, logout, user, isInitialized } = useMoralis();
  const { showModal } = useModalContext();
  const [currentUser, setCurrentUser] = useState(DEFAULT_STATE);
  const [
    accountChangeListenerInitialized,
    setAccountChangeListenerInitialized,
  ] = useState(false);

  const linkAccount = async (account, username) => {
    try {
      await Moralis.link(account);
    } catch (error) {
      console.error(error);
      if (error.message === "this auth is already used") {
        toast.error(
          `This wallet cannot be linked to ${username} because it is already associated with another user. You have been logged out.`
        );
      }
      await logout();
    }
  };

  useEffect(() => {
    if (accountChangeListenerInitialized) {
      return;
    }
    if (!isInitialized) {
      return;
    }
    const initializeEventListeners = () => {
      Moralis.onAccountChanged(async (account) => {
        if (!account) {
          // wallet locked
          return;
        }

        const user = await Moralis.User.current();
        if (!user) {
          toast.error(
            "Something went wrong; your wallet has been disconnected"
          );
          logout();
          return;
        }

        try {
          const accounts = await user.get("accounts");
          if (!accounts) {
            toast.error(
              "Something went wrong; your wallet has been disconnected"
            );
            await logout();
            return;
          }

          const username = user.get("username");
          showModal({
            title: "Link this address to your account",
            body: (
              <>
                <p>
                  {username}, are you sure you want to link the address{" "}
                  {account} to your account?
                </p>
                <p>
                  If you do not want to link the address to your account, you
                  must log out
                </p>
              </>
            ),
            primaryButtonText: "Link address",
            secondaryButtonText: "Cancel",
            primaryButtonAction: async () =>
              await linkAccount(account, username),
          });
        } catch (error) {
          toast.error(error.message);
          await logout();
        }
      });
    };
    initializeEventListeners();
    setAccountChangeListenerInitialized(true);
  }, [isInitialized]);

  const getUserInfo = async (user: Moralis.User): Promise<void> => {
    const {
      username,
      discordUsername,
      gitHubUsername,
      email,
    } = user.attributes;
    let isCertified = false;

    // check if user has certified role
    const certifiedRoleQuery = new Moralis.Query("_Role");
    certifiedRoleQuery.equalTo("name", "certified");
    const certifiedRole = await certifiedRoleQuery.find();
    if (certifiedRole.length > 0) {
      isCertified = true;
    }

    const userResponse = await fetch(
      `/.netlify/functions/get-user?id=${username}`
    );
    if (!userResponse.ok) {
      const error = await userResponse.json();
      if (error.error === "User not found") {
        throw UserLoginError.RegistrationPending;
      }
      throw UserLoginError.Unknown;
    }

    const registeredUser = await userResponse.json();
    if (!registeredUser) {
      throw UserLoginError.RegistrationPending;
    }

    if (!registeredUser.moralisId) {
      throw UserLoginError.ConnectionPending;
    }

    const moralisId = registeredUser.moralisId;
    const link = registeredUser.link || null;
    const image = registeredUser.imageUrl || null;

    const userQuery = new Moralis.Query("_User");
    userQuery.equalTo("objectId", moralisId);

    const query = new Moralis.Query("PaymentAddress");
    query.matchesQuery("user", userQuery);
    query.equalTo("chain", "polygon");
    const results = await query.find();
    const polygonPaymentAddress =
      results.length > 0 ? results[0].attributes.address : undefined;

    // fetching teams
    const teamsResponse = await fetch(
      `/.netlify/functions/get-team?id=${username}`
    );
    let teams: TeamInfo[] = [];
    if (teamsResponse.status === 200) {
      const teamsData: TeamData[] = await teamsResponse.json();
      teams = teamsData.map((team) => {
        const polygonAddress =
          team.paymentAddresses &&
          team.paymentAddresses.find((address) => address.chain === "polygon");
        const ethereumAddress =
          team.paymentAddresses &&
          team.paymentAddresses.find((address) => address.chain === "ethereum");
        return {
          username: team.handle,
          image: team.imageUrl,
          link: team.link,
          polygonAddress: polygonAddress?.address || "",
          ethereumAddress: ethereumAddress?.address || "",
          members: team.members,
        };
      });
    }

    // fetching bot
    const botResponse = await fetch(
      `/.netlify/functions/get-bot?id=${username}`
    );
    let bot: BotInfo | undefined = undefined;
    if (botResponse.status === 200) {
      const botFileData: BotData = await botResponse.json();
      bot = {
        crew: botFileData.crew,
        username: botFileData.handle,
        polygonAddress:
          botFileData.paymentAddresses.find(
            (address) => address.chain === "polygon"
          )?.address || "",
        ethereumAddress:
          botFileData.paymentAddresses.find(
            (address) => address.chain === "ethereum"
          )?.address || "",
        relegated: botFileData.relegated || false,
        image: botFileData.imageUrl,
      };
    }

    setCurrentUser({
      username,
      moralisId,
      discordUsername,
      gitHubUsername,
      polygonPaymentAddress,
      emailAddress: email,
      link,
      image,
      teams,
      isLoggedIn: true,
      isCertified,
      bot,
    });
  };

  const connectWallet = useCallback(async (): Promise<void> => {
    if (!isInitialized) {
      return;
    }
    const user = await Moralis.User.current();
    if (!user) {
      logUserOut();
      return;
    }

    const isRegistrationComplete = await user.get("registrationComplete");
    if (!isRegistrationComplete) {
      const handlesPendingConfirmation = await user.get(
        "handlesPendingConfirmation"
      );
      if (handlesPendingConfirmation && handlesPendingConfirmation.length > 0) {
        navigate("/confirm-account");
        return;
      }
      // check for existing user who has submitted with that address/register them
      const associatedHandles = await Moralis.Cloud.run("findUser");
      if (!associatedHandles || associatedHandles.length < 1) {
        logUserOut();
        throw UserLoginError.Unregistered;
      }
      user.set("handlesPendingConfirmation", associatedHandles);
      await user.save();
      navigate("/confirm-account");
      return;
    } else {
      try {
        await getUserInfo(user);
      } catch (error) {
        throw error;
      }
    }
  }, [isInitialized]);

  const logUserOut = useCallback(() => {
    if (!isInitialized) {
      return;
    }
    logout();
    setCurrentUser(DEFAULT_STATE);
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    // check if user is logged in when page is refreshed
    const checkForUser = async () => {
      if (!isAuthenticated) {
        setCurrentUser(DEFAULT_STATE);
        return;
      } else {
        try {
          // need to explicitly fetch current user because `user` from useMoralis
          // hook is not updated from signup or login with username and password
          const user = await Moralis.User.current();
          if (!user) {
            logUserOut();
          } else {
            const isRegistrationComplete = await user.get(
              "registrationComplete"
            );
            if (isRegistrationComplete) {
              await getUserInfo(user);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkForUser();
  }, [isAuthenticated, user, isInitialized]);

  const reFetchUser = useCallback(async (): Promise<void> => {
    if (!isInitialized) {
      return;
    }
    // need to explicitly fetch current user because `user` from useMoralis
    // hook is not updated from login with username and password
    const user = await Moralis.User.current();
    if (!user) {
      return;
    }
    const isRegistrationComplete = await user.get("registrationComplete");
    if (isRegistrationComplete) {
      await getUserInfo(user);
    }
  }, [isInitialized]);

  const userContext = useMemo(() => {
    return { currentUser, logUserOut, connectWallet, reFetchUser };
  }, [currentUser, logUserOut, connectWallet, reFetchUser]);
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

export const wrapRootElement = ({ element }) => {
  const appId = process.env.GATSBY_MORALIS_APP_ID!;
  const serverUrl = process.env.GATSBY_MORALIS_SERVER!;

  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <ModalProvider>
        <UserProvider>{element}</UserProvider>
      </ModalProvider>
    </MoralisProvider>
  );
};

const useUser = () => {
  const currentUser = useContext(UserContext);

  if (currentUser === undefined) {
    throw new Error("useUser context was used outside of its Provider");
  }

  return currentUser;
};

export default useUser;
