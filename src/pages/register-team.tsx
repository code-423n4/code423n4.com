import React, { useCallback, useEffect, useState } from "react";

import useUser from "../hooks/UserContext";
import ProtectedPage from "../components/ProtectedPage";
import TeamForm from "../components/TeamForm";

export default function TeamRegistration() {
  const { currentUser } = useUser();

  // XXX: switching from gatsby graph
  const [handles, setHandles] = useState<Set<string>>(new Set<string>());
  const [wardens, setWardens] = useState<{ value: any; image: any }[]>([]);

  // fetch wardens
  useEffect(() => {
    //   // fetch handles
    (async () => {
      const result = await fetch(`/.netlify/functions/handles`, {
        headers: {
          "Content-Type": "application/json",
          // "X-Authorization": `Bearer ${sessionToken}`,
          // "C4-User": currentUser.username,
        },
      });
      if (result.ok) {
        let users = await result.json();
        let handles: Set<string> = new Set(users.map((e) => e.handle));
        setHandles(handles);

        let wardens: { value: any; image: any }[] = users.map((e) => {
          return {
            value: e.handle,
            image: e.image ?? "",
          };
        });
        setWardens(wardens);
      } else {
        // @TODO: what to do here?
        throw "Unable to fetch user data.";
      }
    })();
  }, []);

  const onSubmit = useCallback(
    async (requestBody, user) => {
      const sessionToken = user.attributes.sessionToken;

      return await fetch("/.netlify/functions/register-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
    },
    [currentUser]
  );

  return (
    <ProtectedPage
      pageTitle="Team Registration | Code 423n4"
      message="You need to be a registered warden, currently connected via wallet to register a team."
    >
      <div className="wrapper-main">
        <h1 className="page-header">Register a Team</h1>
        <TeamForm
          onSubmit={onSubmit}
          handles={handles}
          wardens={wardens}
          submitButtonText="Register team"
          successMessage={
            <>
              Your registration application has been submitted. Please note: it
              may take a few business days for your submission to be approved.
            </>
          }
        />
      </div>
    </ProtectedPage>
  );
}
