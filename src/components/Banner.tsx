import React from "react";
import useUser from "../hooks/UserContext";
import * as styles from "../styles/Main.module.scss";

export default function Banner() {
  const { currentUser } = useUser();

  return !currentUser.isLoggedIn ? (
    <div className={styles.Banner__MessageBar}>
      <p className={styles.Banner__Message}>
        🐺 <strong>Hey, wardens!</strong> Wallet auth is here! 🎉{" "}
        <strong>Connect now »</strong>
      </p>
    </div>
  ) : null;
}
