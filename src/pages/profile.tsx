import clsx from "clsx";
import { navigate } from "gatsby";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";

import * as styles from "../components/form/Form.module.scss";

export default function ConfirmAccount() {
  // hooks
  const { isAuthenticated, user, isInitialized, isInitializing } = useMoralis();
  const { logUserOut, currentUser } = useUser();


  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const getUser = async (): Promise<void> => {
      if (!isAuthenticated || !user) {
        navigate("/");
        return;
      }

      const handlesPendingConfirmation = await user.get(
        "handlesPendingConfirmation"
      );

      if (handlesPendingConfirmation) {
        navigate("/");
      }
   
    };
    getUser();
  }, [isAuthenticated, user, isInitialized]);

  return (
    <DefaultLayout>
      { isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className={clsx(styles.Form)}>
          <div className={clsx(styles.FormHeader)}>
            <h1 className={clsx(styles.Heading1)}>🐺 Profile</h1>  
          </div>
          <div className="wrapper-main">
            <div className="centered-text">
              <p>
                Username: {currentUser.username}
              </p>
              <p>
                Discord: {currentUser.discordUsername}
              </p>
              <p>
                Github: {currentUser.gitHubUsername}
              </p>
              <p>
                Email: {currentUser.emailAddress}
              </p>
              <p>
                Teams: {
                  (currentUser.teams || []).length === 0 ? "No team" : currentUser.teams.map(e=> e.handle).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
