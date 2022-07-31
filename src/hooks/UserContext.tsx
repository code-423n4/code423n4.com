import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MoralisProvider, useMoralis } from "react-moralis";
import Moralis from "moralis";
import { toast } from "react-toastify";
import { navigate } from "gatsby";
import { ModalProvider, useModalContext } from "./ModalContext";

export enum UserLoginError {
  RegistrationPending = "registration pending",
  ConnectionPending = "connect wallet pending",
  Unregistered = "unregistered",
  Unknown = "",
}

interface UserState {
  address: string;
  username: string;
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  moralisId: string;
  teams: { username: string; address?: string; image?: string }[];
  isLoggedIn: boolean;
  image?: string | undefined;
  link?: string | undefined;
}

interface User {
  currentUser: UserState;
  logUserOut: () => void;
  connectWallet: () => Promise<void>;
  reFetchUser: () => Promise<void>;
}

const DEFAULT_STATE: UserState = {
  address: "",
  username: "",
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  moralisId: "",
  teams: [],
  isLoggedIn: false,
  image: undefined,
  link: undefined,
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
          `Account cannot be linked to ${username} because it is already associated with another user. You have been logged out.`
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

          const username = user.get("c4Username");
          if (!username) {
            toast.error(
              "Only registered users can link accounts; your wallet has been disconnected"
            );
            await logout();
            return;
          }
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
      c4Username,
      ethAddress,
      discordUsername,
      gitHubUsername,
      emailAddress,
    } = user.attributes;
    const userResponse = await fetch(
      `/.netlify/functions/get-user?id=${c4Username}`
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

    // fetching teams
    const teamsResponse = await fetch(
      `/.netlify/functions/get-team?id=${c4Username}`
    );
    let teams = [];
    if (teamsResponse.status === 200) {
      const teamsData = await teamsResponse.json();
      teams = teamsData.map((team) => ({
        username: team.handle,
        address: team.address,
        image: team.imageUrl,
      }));
    }

    setCurrentUser({
      username: c4Username,
      moralisId,
      address: ethAddress,
      discordUsername,
      gitHubUsername,
      emailAddress,
      link,
      image,
      teams,
      isLoggedIn: true,
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

    const username = await user.get("c4Username");
    if (!username) {
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
          if (!user) {
            logUserOut();
          } else {
            const username = await user.get("c4Username");
            if (username) {
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
    if (!isInitialized || !isAuthenticated || !user) {
      return;
    }
    const username = await user.get("c4Username");
    if (username) {
      await getUserInfo(user);
    }
  }, [isInitialized, isAuthenticated, user]);

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
