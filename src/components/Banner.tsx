import React from "react";
import useUser from "../hooks/UserContext";

export default function Banner() {
  const { currentUser } = useUser();

  // TODO: This is unstyled
  return !currentUser.isLoggedIn ? (
    <div>
      <p>
        🐺 <strong>Hey, wardens!</strong> Wallet auth is here! 🎉{" "}
        <strong>Connect now »</strong>
      </p>
    </div>
  ) : null;
}
