import { graphql, navigate } from "gatsby";
import React, { useEffect } from "react";

import useUser from "../../hooks/UserContext";

import DefaultLayout from "../../templates/DefaultLayout";
import RegistrationForm from "../../components/RegistrationForm";

export default function UserRegistration({ data }) {
  const handles: Set<string> = new Set([
    ...data.handles.edges.map((h) => h.node.handle),
    ...data.bots.edges.map((b) => b.node.handle),
  ]);
  const { currentUser } = useUser();

  useEffect((): void => {
    if (currentUser.isLoggedIn) {
      navigate("/");
    }
  }, [currentUser.isLoggedIn]);

  return (
    <DefaultLayout
      pageTitle="Registration | Code4rena"
      hideConnectWalletDropdown={true}
    >
      <div className="limited-width register">
        <div className="Form__Form">
          <h1>Warden Registration</h1>
          <RegistrationForm handles={handles} />
        </div>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
    bots: allBotsJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
