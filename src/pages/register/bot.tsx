import { graphql } from "gatsby";
import React from "react";

import ProtectedPage from "../../components/ProtectedPage";
import BotRegistrationForm from "../../components/BotRegistrationForm";
import { WardenFieldOption } from "../../components/reporter/widgets/WardenField";

export default function TeamRegistration({ data }) {
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

  return (
    <ProtectedPage
      pageTitle="Bot Application | Code4rena"
      message="You need to be a registered warden, currently connected via wallet to register a bot."
    >
      <div className="limited-width">
        <h1>Register a Bot</h1>
        <BotRegistrationForm handles={handles} wardens={wardens} />
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
    bots: allBotsJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
