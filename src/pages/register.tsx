import clsx from "clsx";
import { navigate } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../hooks/UserContext";

import DefaultLayout from "../templates/DefaultLayout";
import RegistrationForm from "../components/RegistrationForm";

import * as styles from "../components/form/Form.module.scss";

export default function UserRegistration() {
  const [handles, setHandles] = useState<Set<string>>(new Set<string>());
  const [wardens, setWardens] = useState<{value: any; image: any; }[]> ([]);
  const [handleData, setHandleData] = useState<any[]>([]);
  const { isInitialized } = useMoralis();
  const { currentUser } = useUser();

  useEffect((): void => {
    if (currentUser.isLoggedIn) {
      navigate("/");
    }
  }, [currentUser.isLoggedIn]);


//do we need this function?? It setting wardens with a filtered set of wardens but then wardens is never used?? What am I missing??
  useEffect((): void => {
    async function filterWardens(): Promise<void> {
      if (!isInitialized) {
        return;
      }
      const wardensWithSubmissions = await Moralis.Cloud.run(
        "getWardensWithSubmissions"
      );
      const wardens = handleData
        .filter((warden) => {
          if (warden.warden) {
            return false;
          }
          if (wardensWithSubmissions.includes(warden.handle)) {
            return false;
          }
          return true;
        })
        .map(( warden ) => ({ value: warden.handle, image: warden.image }));
      setWardens(wardens);
    }
    filterWardens();
  }, [isInitialized, handleData]);

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
        setHandles(new Set(result.map((h) => h.handle)));
        setHandleData(result);
      } else {
        throw "Unable to fetch handle results.";
      }
    })();
  }, [isInitialized]);

  

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

