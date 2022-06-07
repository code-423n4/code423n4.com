import clsx from "clsx";
import { graphql } from "gatsby";
import React, { useState, ReactNode } from "react";

import DefaultLayout from "../templates/DefaultLayout";
import RegistrationForm from "../components/RegistrationForm";

import * as styles from "../components/form/Form.module.scss";

export default function UserRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));

  let wardens = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      // @todo: filter out leaderboard wardens and wardens who have already connected their wallets
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  return (
    <DefaultLayout pageTitle="Registration | Code 423n4">
      <div className="wrapper-main">
        <h1 className="page-header">Warden Registration</h1>
        <div>
          <RegistrationForm
            className={clsx(styles.Form)}
            handles={handles}
            wardens={wardens}
          />
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
