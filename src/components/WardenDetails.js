import React from "react";
import Avatar from "react-avatar";

import * as styles from "./WardenDetails.module.scss";

export default function WardenDetails({ img, username, address }) {
  return (
    <div className={styles.Wrapper}>
      <span>
        <span className={styles.Icon}>
          <Avatar src={img} name={username} size="32px" round="32px" />
        </span>
        {username}
      </span>
      {address && (
        <span className={styles.Address}>
          {address.slice(0, 5) + "..." + address.slice(-4)}
        </span>
      )}
    </div>
  );
}
