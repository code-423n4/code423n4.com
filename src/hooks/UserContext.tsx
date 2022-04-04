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
  isLoggedIn: boolean;
  img?: string;
  link?: string;
}

const DEFAULT_STATE: UserState = {
  address: "",
  username: "",
  isLoggedIn: false,
  img: "",
  link: "",
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
    const getUser = async () => {
      if (!isAuthenticated) {
        return;
      }
      const username = await user.get("c4Username");
      const address = await user.get("ethAddress");

      // @todo: check that user is registered, then
      // get user's social link and avatar

      setCurrentUser({
        username,
        address,
        isLoggedIn: true,
      });
    };
    getUser();
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
  const user = Moralis.User.current();
  console.log("account changed. user = ", user);
  if (user) {
    try {
      const accounts = user.get("accounts");
      if (accounts.includes(account)) {
        await user.set("ethAddress", account);
        console.log("eth address", user.get("ethAddress"));
        return;
      }
      const username = user.get("c4Username");
      const confirmed = confirm(
        `Are you sure you want to link your account ${account} to ${username}?`
      );
      if (confirmed) {
        await Moralis.link(account);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

export default useUser;
