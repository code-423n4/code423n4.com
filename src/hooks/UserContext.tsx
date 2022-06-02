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
  teams: { username: string; address?: string; img?: string }[];
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
  teams: [],
  isLoggedIn: false,
  img: null,
  link: null,
};

const UserContext = createContext({ currentUser: DEFAULT_STATE });

const UserProvider = ({ children }) => {
  const { isAuthenticated, logout, user } = useMoralis();
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
    const initializeEventListeners = () => {
      Moralis.onAccountChanged(async (account) => {
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
            secondaryButtonText: "Logout",
            primaryButtonAction: async () =>
              await linkAccount(account, username),
            secondaryButtonAction: logout,
          });
        } catch (error) {
          toast.error(error.message);
          await logout();
        }
      });
    };
    initializeEventListeners();
    setAccountChangeListenerInitialized(true);
  }, []);

  const getUserInfo = async (user: Moralis.User): Promise<void> => {
    const {
      c4Username,
      ethAddress,
      discordUsername,
      gitHubUsername,
      emailAddress,
    } = user.attributes;
    const response = await fetch(
      `/.netlify/functions/get-user?id=${c4Username}`
    );
    if (!response.ok) {
      const error = await response.json();
      if (error.error === "User not found") {
        throw UserLoginError.Pending;
      }
      throw UserLoginError.Unknown;
    }


    // fetching team
    const teamResponse = await fetch(
      `/.netlify/functions/get-team?id=${c4Username}`
    );
    let team = [];
    if (teamResponse.status === 200) {
      team = await teamResponse.json();
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
      teams: team,
      isLoggedIn: true,
    });
  };

  const connectWallet = useCallback(async (): Promise<void> => {
    const user = await Moralis.User.current();
    if (!user) {
      logUserOut();
      return;
    }

    const username = await user.get("c4Username");
    const handlesPendingConfirmation = await user.get(
      "handlesPendingConfirmation"
    );
    if (handlesPendingConfirmation) {
      navigate("/confirm-account");
    }
    if (!username) {
      // check for existing user who has submitted with that address/register them
      const associatedHandles = await Moralis.Cloud.run("findUser");
      if (!associatedHandles || associatedHandles.length < 1) {
        logUserOut();
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

// @todo: move this into root context
export const wrapRootElement = ({ element }) => (
  <MoralisProvider
    appId={process.env.GATSBY_MORALIS_APP_ID}
    serverUrl={process.env.GATSBY_MORALIS_SERVER}
  >
    <ModalProvider>
      <UserProvider>{element}</UserProvider>
    </ModalProvider>
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
