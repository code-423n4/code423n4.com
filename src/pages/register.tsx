import clsx from "clsx";
import { graphql, navigate } from "gatsby";
import Moralis from "moralis";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";
import RegistrationForm from "../components/RegistrationForm";

import * as styles from "../components/form/Form.module.scss";

export default function UserRegistration({ data }) {
  const handles = new Set(data.handles.edges.map((h) => h.node.handle));
  const [wardens, setWardens] = useState([]);
  const { isInitialized } = useMoralis();
  const { currentUser } = useUser();

  useEffect((): void => {
    if (currentUser.isLoggedIn) {
      navigate("/");
    }
  }, [currentUser.isLoggedIn]);

  useEffect((): void => {
    async function filterWardens(): Promise<void> {
      if (!isInitialized) {
        return;
      }
      const wardensWithSubmissions = await Moralis.Cloud.run(
        "getWardensWithSubmissions"
      );

      const wardens = data.handles.edges
        .filter(({ node }) => {
          if (node.members) {
            return false;
          }
          if (wardensWithSubmissions.includes(node.handle)) {
            return false;
          }
          return true;
        })
        .map(({ node }) => ({ value: node.handle, image: node.image }));
      setWardens(wardens);
    }
    filterWardens();
  }, [data, isInitialized]);

  return (
    <DefaultLayout
      pageTitle="Registration | Code 423n4"
      hideConnectWalletDropdown={true}
    >
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
