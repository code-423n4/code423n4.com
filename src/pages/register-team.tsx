import clsx from "clsx";
import { graphql } from "gatsby";
import React, { useState, ReactNode } from "react";

import DefaultLayout from "../templates/DefaultLayout";
import TeamRegistrationForm from "../components/TeamRegistrationForm";
import useUser from "../hooks/UserContext";
import Login from "../components/Login/Login";
import * as styles from "../components/form/Form.module.scss";

export default function TeamRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));
  const { currentUser } = useUser();

  let wardens: { value: string; image: string }[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  return (
    <DefaultLayout pageTitle="Team Registration | Code 423n4">
      {currentUser.isLoggedIn ? (
        <div className="wrapper-main">
          <h1 className="page-header">Register a Team</h1>
          <div>
            <TeamRegistrationForm
              className={clsx(styles.Form)}
              handles={handles}
              wardens={wardens}
            />
          </div>
        </div>
      ) : (
        <div className="centered-text">
          <div className={clsx(styles.Form)}>
            <h1>Please login</h1>
            <p>
              You need to be a registered warden, currently connected via wallet
              to register a team.
            </p>
            <Login displayAsButtons={true} />
          </div>
        </div>
      )}
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
