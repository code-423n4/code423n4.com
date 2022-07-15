import Moralis from "moralis";
import React, { useEffect, useState } from "react";

import useUser from "../../hooks/UserContext";

import ProtectedPage from "../../components/ProtectedPage";

export default function FindingsPage({ data, location }) {
  const { currentUser } = useUser();

  const [findingsList, setFindingsList] = useState([]);

  // optionally? support url params for contest
  const params = new URLSearchParams(location.search);
  console.log(`Query param contest: ${params.get("contest")}`);

  // with a state variable, get specific contest
  console.log(`Link state contest: ${location.state?.contestId}`);

  useEffect(() => {
    if (currentUser.isLoggedIn) {
      const user = Moralis.User.current();
      const sessionToken = user?.attributes.sessionToken;

      const q = new URLSearchParams({});

      if ( location.state?.contestId !== undefined ) {
        q.append("contest", location.state?.contestId);
      }
    
      fetch(`/.netlify/functions/manage-findings?` + q, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
      })
        .then((response) => response.json())
        .then((resultData) => {
          setFindingsList(resultData);
        });
    }
  }, [currentUser]);

  return (
    <ProtectedPage
      pageTitle="View Findings"
      message="You need to be a registered warden, currently connected via wallet, to view findings."
    >
      <div className="wrapper-main">
        <h1 className="page-header">View Findings</h1>
        {/* Teh findings */}
        <p>{JSON.stringify(findingsList)}</p>
      </div>
    </ProtectedPage>
  );
}
