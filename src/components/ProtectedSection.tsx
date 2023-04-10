import React, { ReactNode } from "react";

import useUser from "../hooks/UserContext";
import Login from "../components/Login/Login";

interface ProtectedSectionProps {
  children: JSX.Element;
  message?: string | ReactNode;
}

export default function ProtectedSection({
  children,
  message,
}: ProtectedSectionProps) {
  const { currentUser } = useUser();

  return (
    <>
      {currentUser.isLoggedIn ? (
        children
      ) : (
        <section className="protected-section center--text">
          <div>
            <h1>Please log in</h1>
            <p>{message || "You must be logged in to view this area."}</p>
            <Login displayAsButtons={true} />
          </div>
        </section>
      )}
    </>
  );
}
