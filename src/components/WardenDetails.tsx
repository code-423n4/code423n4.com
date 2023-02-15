import clsx from "clsx";
import React from "react";
import Avatar from "react-avatar";

import * as styles from "../styles/Main.module.scss";

interface WardenDetailsProps {
  username: string;
  image?: string;
  className?: string;
  avatarSize?: string;
}

export default function WardenDetails({
  image,
  username,
  className,
  avatarSize,
}: WardenDetailsProps) {
  return (
    <div className={clsx(styles.WardenDetails__Wrapper, className)}>
      <div className={styles.WardenDetails__Username}>
        <span className={styles.WardenDetails__Icon}>
          <Avatar
            src={image}
            name={username}
            size={avatarSize || "32px"}
            round={avatarSize || "32px"}
          />
        </span>
        <span>{username}</span>
      </div>
    </div>
  );
}
