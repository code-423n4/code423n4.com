import React from "react";

import ProtectedPage from "../../components/ProtectedPage";

export default function FindingsPage({ data }) {
  return (
    <ProtectedPage
      pageTitle="View Findings"
      message="You need to be a registered warden, currently connected via wallet, to view findings."
    >
      <div className="wrapper-main">
        <h1 className="page-header">View Findings</h1>
        {/* Teh findings */}
      </div>
    </ProtectedPage>
  );
}
