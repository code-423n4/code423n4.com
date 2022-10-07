import React from "react";
import useUser from "../hooks/UserContext";
import * as styles from "./Banner.module.scss";

export default function Banner() {
  const { currentUser } = useUser();

  return !currentUser.isLoggedIn ? (
    <div className={styles.MessageBar}>
      <p className={styles.Message}>
        🐺 <strong>Hey, wardens!</strong> Wallet auth is here! 🎉{" "}
        <strong>Connect now »</strong>
      </p>
    </div>
  ) : null;
}
