import { graphql } from "gatsby";
import React from "react";

import ProtectedPage from "../components/ProtectedPage";
import TeamRegistrationForm from "../components/TeamRegistrationForm";

import * as styles from "../components/form/Form.module.scss";

export default function TeamRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));

  let wardens: { value: string; image: string }[] = [];
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
        <TeamRegistrationForm
          className={clsx(styles.Form)}
          handles={handles}
          wardens={wardens}
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
