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
import { graphql, StaticQuery } from "gatsby";

export enum UserLoginError {
  Unregistered = "unregistered",
  Pending = "registration pending",
}

interface UserState {
  address: string;
  username: string;
  discordUsername: string;
  moralisId: string;
  isLoggedIn: boolean;
  img?: string | null;
  link?: string | null;
}

interface User {
  currentUser: UserState;
  logUserOut?: () => void;
  login?: () => Promise<void>;
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

const UserContext = createContext<User>({ currentUser: DEFAULT_STATE });

const UserProvider = ({ children }) => {
  const { isAuthenticated, logout, user } = useMoralis();
  const [currentUser, setCurrentUser] = useState(DEFAULT_STATE);

  const wardensQuery = graphql`
    query {
      handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
        edges {
          node {
            handle
            link
            moralisId
            image {
              childImageSharp {
                resize(width: 64, quality: 90) {
                  src
                }
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    const initializeEventListeners = () => {
      // @todo: verify expected behavior here and implement/communicate it properly
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
            await logout();
          }
        } catch (error) {
          console.error(error);
          await logout();
        }
      });
    };
    initializeEventListeners();
  }, []);

  return (
    <StaticQuery
      query={wardensQuery}
      render={(data) => {
        const handles = data.handles.edges;

        const login = useCallback(async (): Promise<void> => {
          const user = Moralis.User.current();
          if (!user) {
            logUserOut();
          }

          const username = await user.get("c4Username");

          if (!username) {
            await logUserOut();
            throw UserLoginError.Unregistered;
          }

          const registeredUser = handles.find((handle) => {
            return handle.node.handle === username;
          });

          if (!registeredUser || !registeredUser.node.moralisId) {
            await logUserOut();
            throw UserLoginError.Pending;
          }
          const moralisId = registeredUser.node.moralisId;
          const address = await user.get("ethAddress");
          const discordUsername = await user.get("discordUsername");
          const link = registeredUser.node.link || null;
          const img =
            registeredUser.node.image?.childImageSharp.resize.src || null;

          setCurrentUser({
            username,
            moralisId,
            address,
            discordUsername,
            link,
            img,
            isLoggedIn: true,
          });
        }, []);

        const logUserOut = useCallback(() => {
          logout();
          setCurrentUser(DEFAULT_STATE);
        }, []);

        useEffect(() => {
          const getUser = async () => {
            if (!isAuthenticated) {
              setCurrentUser(DEFAULT_STATE);
              return;
            }
            try {
              await login();
            } catch (error) {
              console.error(error);
            }
          };
          getUser();
        }, [isAuthenticated, user]);

        const userContext = useMemo(() => {
          return { currentUser, logUserOut, login };
        }, [currentUser, logUserOut, login]);
        return (
          <UserContext.Provider value={userContext}>
            {children}
          </UserContext.Provider>
        );
      }}
    />
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
