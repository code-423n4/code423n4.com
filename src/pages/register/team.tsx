import { graphql } from "gatsby";
import React, { useCallback } from "react";

import useUser from "../../hooks/UserContext";
import ProtectedPage from "../../components/ProtectedPage";
import TeamForm from "../../components/TeamForm";
import { WardenFieldOption } from "../../components/reporter/widgets/WardenField";

export default function TeamRegistration({ data }) {
  const { currentUser } = useUser();
  const handles: Set<string> = new Set([
    ...data.handles.edges.map((h) => h.node.handle),
    ...data.bots.edges.map((b) => b.node.handle),
  ]);

  let wardens: WardenFieldOption[] = [];
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
      pageTitle="Team Registration | Code4rena"
      message="You need to be a registered warden, currently connected via wallet to register a team."
    >
      <div className="limited-width">
        <h1>Register a Team</h1>
        <TeamForm
          onSubmit={onSubmit}
          handles={handles}
          wardens={wardens}
          submitButtonText="Register team"
          successMessage={
            <p>
              Your registration application has been submitted. Please note: it
              may take a few business days for your submission to be approved.
            </p>
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
    bots: allBotsJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
