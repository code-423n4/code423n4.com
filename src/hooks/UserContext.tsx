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

export enum UserLoginError {
  Unregistered = "unregistered",
  Pending = "registration pending",
  Unknown = "",
}

interface UserState {
  address: string;
  username: string;
  discordUsername: string;
  gitHubUsername: string;
  emailAddress: string;
  moralisId: string;
  isLoggedIn: boolean;
  img?: string | null;
  link?: string | null;
}

interface User {
  currentUser: UserState;
  logUserOut?: () => void;
  connectWallet?: () => Promise<void>;
}

const DEFAULT_STATE: UserState = {
  address: "",
  username: "",
  discordUsername: "",
  gitHubUsername: "",
  emailAddress: "",
  moralisId: "",
  isLoggedIn: false,
  img: null,
  link: null,
};

const UserContext = createContext<User>({ currentUser: DEFAULT_STATE });

const UserProvider = ({ children }) => {
  const { isAuthenticated, logout, user } = useMoralis();
  const [currentUser, setCurrentUser] = useState(DEFAULT_STATE);

  useEffect(() => {
    const initializeEventListeners = () => {
      Moralis.onAccountChanged(async (account) => {
        const user = await Moralis.User.current();
        if (!user) {
          logout();
          return;
        }

        try {
          const accounts = user.get("accounts");
          if (!accounts) {
            await logout();
            return;
          }

          const username = user.get("c4Username");
          // @todo: implement a custom confirmation modal
          const confirmed = confirm(
            `Are you sure you want to link your account ${account} to ${username}?`
          );
          if (!confirmed) {
            await logout();
            return;
          }

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
        } catch (error) {
          console.error(error);
          toast.error(error.message);
          await logout();
        }
      });
      return Moralis.removeAllListeners();
    };
    initializeEventListeners();
  }, []);

  const getUserInfo = async (user: Moralis.User): Promise<void> => {
    const {
      c4Username,
      ethAddress,
      discordUsername,
      gitHubUsername,
      emailAddress,
    } = user.attributes;
    const response = await fetch(`/.netlify/functions/users?id=${c4Username}`);
    if (!response.ok) {
      const error = await response.json();
      if (error.error === "User not found") {
        throw UserLoginError.Pending;
      }
      throw UserLoginError.Unknown;
    }

    const registeredUser = await response.json();
    if (!registeredUser || !registeredUser.moralisId) {
      throw UserLoginError.Pending;
    }

    if (registeredUser.image) {
      // remove the relative part of the path
      const imagePath = registeredUser.image.slice(2);
      const imgResponse = await fetch(
        `https://raw.githubusercontent.com/code-423n4/code423n4.com/main/_data/handles/${imagePath}`
      );
      if (imgResponse.ok) {
        registeredUser.image = imgResponse.url;
      }
    }
    const moralisId = registeredUser.moralisId;
    const link = registeredUser.link || null;
    const img = registeredUser.image || null;

    setCurrentUser({
      username: c4Username,
      moralisId,
      address: ethAddress,
      discordUsername,
      gitHubUsername,
      emailAddress,
      link,
      img,
      isLoggedIn: true,
    });
  };

  const connectWallet = useCallback(async (): Promise<void> => {
    const user = await Moralis.User.current();
    if (!user) {
      logUserOut();
    }

    const username = await user.get("c4Username");
    const handlesPendingConfirmation = await user.get(
      "handlesPendingConfirmation"
    );
    if (handlesPendingConfirmation) {
      navigate("/confirm-account");
      return;
    }
    if (!username) {
      // check for existing user who has submitted with that address/register them
      const associatedHandles = await Moralis.Cloud.run("findUser");
      console.log("ASSOCIATED USERS", associatedHandles);
      if (!associatedHandles || associatedHandles.length < 1) {
        navigate("/register");
        return;
      }
      user.set("handlesPendingConfirmation", associatedHandles);
      await user.save();
      navigate("/confirm-account");
    } else {
      try {
        await getUserInfo(user);
      } catch (error) {
        throw error;
      }
    }
  }, []);

  const logUserOut = useCallback(() => {
    logout();
    setCurrentUser(DEFAULT_STATE);
  }, []);

  useEffect(() => {
    // check if user is logged in when page is refreshed
    const checkForUser = async () => {
      if (!isAuthenticated) {
        setCurrentUser(DEFAULT_STATE);
        return;
      } else {
        try {
          const user = await Moralis.User.current();
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
  }, [isAuthenticated, user]);

  const userContext = useMemo(() => {
    return { currentUser, logUserOut, connectWallet };
  }, [currentUser, logUserOut, connectWallet]);
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

export const wrapRootElement = ({ element }) => (
  <MoralisProvider
    appId={process.env.GATSBY_MORALIS_APP_ID}
    serverUrl={process.env.GATSBY_MORALIS_SERVER}
  >
    <UserProvider>{element}</UserProvider>
  </MoralisProvider>
);

const useUser = () => {
  const currentUser = useContext(UserContext);

  if (currentUser === undefined) {
    throw new Error("useUser context was used outside of its Provider");
  }

  return currentUser;
};

export default useUser;
