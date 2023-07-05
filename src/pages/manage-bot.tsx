import { graphql } from "gatsby";
import React from "react";

import { WardenFieldOption } from "../components/reporter/widgets/WardenField";
import ProtectedPage from "../components/ProtectedPage";
import BotManagementForm from "../components/BotManagementForm";

export default function BotManagement({ data, location }) {
  let wardens: WardenFieldOption[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  return (
    <ProtectedPage
      pageTitle="Manage Team | Code 423n4"
      message="You need to be a registered warden, currently connected via wallet to manage a team."
    >
      <BotManagementForm location={location} wardens={wardens} />
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
