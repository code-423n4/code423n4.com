import React from "react";
import useUser from "../hooks/UserContext";

export default function FeatureBanner({ guestOnly, message }) {
  const { currentUser } = useUser();

  return guestOnly ? (
    !currentUser.isLoggedIn ? (
      <div className="message-bar">
        <p>{message}</p>
      </div>
    ) : null
  ) : (
    <div className="message-bar">
      <p>{message}</p>
    </div>
  );
}
