import clsx from "clsx";
import React from "react";
import Avatar from "react-avatar";

import * as styles from "./WardenDetails.module.scss";

interface WardenDetailsProps {
  username: string;
  image?: string;
  address?: string;
  className?: string;
}

export default function WardenDetails({
  image,
  username,
  address,
  className,
}: WardenDetailsProps) {
  return (
    <div className={clsx(styles.Wrapper, className)}>
      <div className={styles.Username}>
        <span className={styles.Icon}>
          <Avatar src={image} name={username} size="32px" round="32px" />
        </span>
        <span>{username}</span>
      </div>
      {address && (
        <span className={styles.Address}>
          {address.slice(0, 5) + "..." + address.slice(-4)}
        </span>
      )}
    </div>
  );
}
