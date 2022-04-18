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

interface UserState {
  address: string;
  username: string;
  discordUsername: string;
  moralisId: string;
  isLoggedIn: boolean;
  img?: string | null;
  link?: string | null;
}

const DEFAULT_STATE: UserState = {
  address: "",
  username: "",
  discordUsername: "",
  moralisId: "",
  isLoggedIn: false,
  img: null,
  link: null,
};

interface User {
  currentUser: UserState;
  logUserOut?: () => void;
  login?: (user: UserState) => void;
}

const UserContext = createContext<User>({ currentUser: DEFAULT_STATE });

const UserProvider = ({ children }) => {
  const { isAuthenticated, logout, user } = useMoralis();
  const [currentUser, setCurrentUser] = useState(DEFAULT_STATE);

  const login = useCallback((user: UserState) => {
    setCurrentUser(user);
  }, []);

  const logUserOut = useCallback(() => {
    logout();
    setCurrentUser(DEFAULT_STATE);
  }, []);

  useEffect(() => {
    const resetUserOnLogout = async () => {
      if (!isAuthenticated) {
        setCurrentUser(DEFAULT_STATE);
        return;
      }
    };
    resetUserOnLogout();
  }, [isAuthenticated, user]);

  const userContext = useMemo(() => {
    return { currentUser, logUserOut, login };
  }, [currentUser, logUserOut, login]);

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

// @todo: verify expected behavior here and implement/communicate it properly
Moralis.onAccountChanged(async (account) => {
  const user = await Moralis.User.current();
  console.log("account changed. user = ", user);

  if (!user) {
    Moralis.User.logOut();
    return;
  }

  try {
    const accounts = user.get("accounts");
    if (!accounts) {
      await Moralis.User.logOut();
      return;
    }
    // if this account is already linked, make the address the default
    if (accounts.includes(account)) {
      await user.set("ethAddress", account);
      return;
    }
    const username = user.get("c4Username");
    // @todo: implement a custom confirmation modal
    const confirmed = confirm(
      `Are you sure you want to link your account ${account} to ${username}?`
    );
    if (!confirmed) {
      await Moralis.User.logOut();
      return;
    }
    await Moralis.link(account);
  } catch (error) {
    console.error(error);
    await Moralis.User.logOut();
  }
});

export default useUser;
