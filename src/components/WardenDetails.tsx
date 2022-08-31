import clsx from "clsx";
import React from "react";
import Avatar from "react-avatar";

import * as styles from "./WardenDetails.module.scss";

interface WardenDetailsProps {
  username: string;
  image?: string;
  className?: string;
}

export default function WardenDetails({
  image,
  username,
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
    </div>
  );
}
