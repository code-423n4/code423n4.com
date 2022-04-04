import React from "react";
import { useMoralis } from "react-moralis";
import useUser from "../../hooks/UserContext";
import { graphql, StaticQuery } from "gatsby";
import Moralis from "moralis/types";
import { toast } from "react-toastify";

import Dropdown from "../Dropdown";

import * as styles from "./Login.module.scss";

const Login = () => {
  const { logUserOut } = useUser();
  const { authenticate } = useMoralis();

  const wardensQuery = graphql`
    query {
      handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
        edges {
          node {
            handle
            link
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

  return (
    <StaticQuery
      query={wardensQuery}
      render={(data) => {
        const handles = data.handles.edges;

        const handleLogin = async (
          provider: Moralis.Web3ProviderType = "metamask"
        ) => {
          try {
            const user = await authenticate({ provider });
            const username = await user.get("c4Username");

            // user has not filled out registration yet
            if (!username) {
              await logUserOut();
              toast.error(
                "There is no account associated with the address you provided. " +
                  "If you are a new user, please register. " +
                  "If you registered with us previously, you may need to register again " +
                  "to claim your account."
              );
              return;
            }

            const registeredUser = handles.find((handle) => {
              return handle.node.handle === username;
            });

            // registration is pending
            if (!registeredUser || !registeredUser.id) {
              await logUserOut();
              toast.error(
                <span>
                  It looks like your account registration is pending. Don't
                  forget to join us in{" "}
                  <a href="https://discord.gg/code4rena" target="_blank">
                    Discord
                  </a>{" "}
                  and give us a howl in #i-want-to-be-a-warden so we can
                  complete your registration.
                </span>
              );
              return;
            }
          } catch (error) {
            await logUserOut();
            toast.error(
              "Something went wrong. Please refresh the page and try again."
            );
          }
        };

        const loginButton = () => (
          <span>
            Login <span aria-hidden>▾</span>
          </span>
        );

        return (
          <Dropdown
            wrapperClass={styles.LoginButtonWrapper}
            triggerButtonClass={styles.LoginButton}
            triggerButton={loginButton()}
            openOnHover={true}
          >
            <button onClick={() => handleLogin()} className={styles.Button}>
              Login with MetaMask
            </button>
            <button
              onClick={() => handleLogin("walletConnect")}
              className={styles.Button}
            >
              Login with WalletConnect
            </button>
          </Dropdown>
        );
      }}
    />
  );
};

export default Login;
