import { graphql } from "gatsby";
import React from "react";

import ProtectedPage from "../components/ProtectedPage";
import TeamRegistrationForm from "../components/TeamRegistrationForm";

export default function TeamRegistration({ data }) {
  const handles: Set<string> = new Set(
    data.handles.edges.map((h) => h.node.handle)
  );

  let wardens: { value: string; image: unknown }[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  return (
    <ProtectedPage
      pageTitle="Team Registration | Code 423n4"
      message="You need to be a registered warden, currently connected via wallet to register a team."
    >
      <div className="wrapper-main">
        <h1 className="page-header">Register a Team</h1>
        <p className="center">
          Before you register your team, please ensure each member has connected
          their wallet to their C4 account.
        </p>
        <TeamRegistrationForm handles={handles} wardens={wardens} />
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
              resize(width: 64, quality: 90) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
