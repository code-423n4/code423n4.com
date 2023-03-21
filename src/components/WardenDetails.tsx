import clsx from "clsx";
import React from "react";
import Avatar from "react-avatar";

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
    <div className={clsx("warden-details__wrapper", className)}>
      <div className={"warden-details__username"}>
        <span className={"warden-details__icon"}>
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
