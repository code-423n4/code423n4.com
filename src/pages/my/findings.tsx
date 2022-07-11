import React, { useEffect, useState } from "react";

import ProtectedPage from "../../components/ProtectedPage";

export default function FindingsPage({ data, location }) {
  const [findingsList, setFindingsList] = useState([]);

  // optionally? support url params for contest
  const params = new URLSearchParams(location.search);
  console.log(`Query param contest: ${params.get("contest")}`);

  // with a state variable, get specific contest
  console.log(`Link state contest: ${location.state?.contestId}`);

  const q = new URLSearchParams({})
  if ( location.state?.contestId !== undefined ) {
    q.append("contest", location.state?.contestId);
  }

  useEffect(() => {
    fetch(`/.netlify/functions/edit-finding?` + q, {
      // method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify({
      //   contestId,
      // })
    })
      .then((response) => response.json())
      .then((resultData) => {
        setFindingsList(resultData);
      });
  }, []);

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
