import React, { ReactNode } from "react";

import useUser from "../hooks/UserContext";
import DefaultLayout from "../templates/DefaultLayout";
import Login from "../components/Login/Login";

interface ProtectedPageProps {
  children: JSX.Element;
  pageTitle: string;
  bodyClass?: string;
  message?: string | ReactNode;
  pageDescription?: string;
}

export default function ProtectedPage({
  children,
  pageTitle,
  bodyClass,
  message,
  pageDescription,
}: ProtectedPageProps) {
  const { currentUser } = useUser();

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      bodyClass={bodyClass}
    >
      {currentUser.isLoggedIn ? (
        children
      ) : (
        <section className="limited-width limited-width--centered limited-width--background">
          <div>
            <h1>Please log in</h1>
            <p>{message || "You must be logged in to view this page."}</p>
            <Login displayAsButtons={true} />
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
