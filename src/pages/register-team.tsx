import { graphql } from "gatsby";
import React, { useCallback } from "react";

import useUser from "../hooks/UserContext";
import ProtectedPage from "../components/ProtectedPage";
import TeamForm from "../components/TeamForm";

export default function TeamRegistration({ data }) {
  const { currentUser } = useUser();
  const handles: Set<string> = new Set(
    data.handles.edges.map((h) => h.node.handle)
  );

  let wardens: { value: string; image: unknown }[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  const onSubmit = useCallback(
    async (requestBody, user) => {
      const sessionToken = user.attributes.sessionToken;

      return await fetch("/.netlify/functions/register-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
    },
    [currentUser]
  );

  return (
    <ProtectedPage
      pageTitle="Team Registration | Code 423n4"
      message="You need to be a registered warden, currently connected via wallet to register a team."
    >
      <div className="wrapper-main">
        <h1 className="page-header">Register a Team</h1>
        <TeamForm
          onSubmit={onSubmit}
          handles={handles}
          wardens={wardens}
          submitButtonText="Register team"
          successMessage={
            <>
              Your registration application has been submitted. Please note: it
              may take a few business days for your submission to be approved.
            </>
          }
        />
      </div>
    </ProtectedPage>
  );
}

export const query = graphql`
  query {
    handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
          link
          moralisId
          members {
            handle
          }
          image {
            childImageSharp {
              resize(width: 80) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
