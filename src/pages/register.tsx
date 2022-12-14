import clsx from "clsx";
import { graphql,navigate } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";
import RegistrationForm from "../components/RegistrationForm";

import * as styles from "../components/form/Form.module.scss";

export default function UserRegistration({ data }) {
  // const handles = new Set(data.handles.edges.map((h) => h.node.handle));
  const [handles, setHandles] = useState([]);
  const [wardens, setWardens] = useState([]);
  const { isInitialized } = useMoralis();
  const { currentUser } = useUser();

  console.log(data.handles.edges[601].node.image);
  useEffect((): void => {
    if (currentUser.isLoggedIn) {
      navigate("/");
    }
  }, [currentUser.isLoggedIn]);

  
//this needs to be updated to use the handles from the netlify function.

  // useEffect((): void => {
  //   async function filterWardens(): Promise<void> {
  //     if (!isInitialized) {
  //       return;
  //     }
  //     const wardensWithSubmissions = await Moralis.Cloud.run(
  //       "getWardensWithSubmissions"
  //     );
  //       console.log(data.handles.edges);
  //     const wardens = data.handles.edges
  //       .filter(({ node }) => {
  //         if (node.members) {
  //           return false;
  //         }
  //         if (wardensWithSubmissions.includes(node.handle)) {
  //           return false;
  //         }
  //         return true;
  //       })
  //       .map(({ node }) => ({ value: node.handle, image: node.image }));
  //     setWardens(wardens);
  //   }
  //   filterWardens();
  // }, [wardens, isInitialized]);

  // this is for getting handles from netlify function. 
  useEffect(() => {
    (async () => {
      const result = await fetch(`/.netlify/functions/handles`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      .then((res) => {
          return res;
      });
      if (result) {
        setHandles(result);
      } else {
        throw "Unable to fetch handle results.";
      }
    })();
  }, []);

  

  return (
    <DefaultLayout
      pageTitle="Registration | Code 423n4"
      hideConnectWalletDropdown={true}
    >
      <div className="wrapper-main">
        <div className={styles.Form}>
          <h1 className={styles.Heading1}>Warden Registration</h1>
          <RegistrationForm handles={handles} />
        </div>
      </div>
    </DefaultLayout>
  );
}
// update call here with new endpoint for handles
// export const query = graphql`
//   query {
//     handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
//       edges {
//         node {
//           handle
//           link
//           moralisId
//           members {
//             handle
//           }
//           image {
//             childImageSharp {
//               resize(width: 80) {
//                 src
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;
