import React from "react";
import useUser from "../hooks/UserContext";
import * as styles from "./Banner.module.scss";

export default function Banner() {
  const { currentUser } = useUser();

  return !currentUser.isLoggedIn ? (
    <div className={styles.MessageBar}>
      <p>
        📣 <strong>Attention Wardens:</strong> Effective June 27, you must
        connect your wallet in order to compete in audit contests. 📣
      </p>
    </div>
  ) : null;
}
