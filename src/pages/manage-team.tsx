import { graphql } from "gatsby";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect, useState } from "react";

//types
import {
  TeamCreateRequest,
  TeamData,
  TeamUpdateRequest,
} from "../../types/user";

// hooks
import useUser, { TeamInfo } from "../hooks/UserContext";

// components
import ProtectedPage from "../components/ProtectedPage";
import TeamForm, { TeamState } from "../components/TeamForm";
import { WardenFieldOption } from "../components/reporter/widgets/WardenField";

export default function TeamManagement({ data, location }) {
  const { currentUser } = useUser();

  const [unauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [teamState, setTeamState] = useState<TeamState | undefined>();
  const [teamMembers, setTeamMembers] = useState<
    WardenFieldOption[] | undefined
  >();

  useEffect(() => {
    (async () => {
      if (location.state && location.state.team) {
        const team: TeamInfo = location.state.team;
        initializeState(team);
      } else if (!location.search) {
        return;
      }
      const params = new URLSearchParams(location.search);
      const teamName = params.get("team");
      if (!teamName) {
        return;
      }
      const teamResponse = await fetch(
        `/.netlify/functions/get-user?id=${teamName}`
      );
      if (teamResponse.status === 200) {
        const teamData: TeamData = await teamResponse.json();
        const polygonAddress =
          teamData.paymentAddresses &&
          teamData.paymentAddresses.find(
            (address) => address.chain === "polygon"
          );
        const ethereumAddress =
          teamData.paymentAddresses &&
          teamData.paymentAddresses.find(
            (address) => address.chain === "ethereum"
          );
        const team: TeamInfo = {
          username: teamData.handle,
          image: teamData.imageUrl,
          link: teamData.link,
          polygonAddress: polygonAddress?.address,
          ethereumAddress: ethereumAddress?.address,
          members: teamData.members,
        };
        initializeState(team);
      }
    })();
  }, [location, currentUser]);

  const initializeState = (team: TeamInfo) => {
    if (!team.members.includes(currentUser.username)) {
      setIsUnauthorized(true);
      return;
    }
    setIsUnauthorized(false);

    const members: WardenFieldOption[] = [];
    team.members.forEach((m) => {
      const member = wardens.find((warden) => warden.value === m);
      member && members.push(member);
    });
    setTeamMembers(members);

    const state: TeamState = {
      teamName: team.username,
      polygonAddress: team.polygonAddress || "",
      ethereumAddress: team.ethereumAddress || "",
      link: team.link,
      teamImage: team.image,
    };
    setTeamState(state);
  };

  const handles: Set<string> = new Set(
    data.handles.edges.map((h) => h.node.handle)
  );

  let wardens: WardenFieldOption[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  const onSubmit = useCallback(
    async (data: TeamCreateRequest, user) => {
      const sessionToken = user.attributes.sessionToken;
      if (!teamState || !teamMembers) {
        throw "Missing old information";
      }
      if (
        isEqual(
          data.members,
          teamMembers.map((member) => member.value)
        ) &&
        !data.image &&
        data.link === teamState.link &&
        data.ethereumAddress === teamState.ethereumAddress &&
        data.polygonAddress === teamState.polygonAddress
      ) {
        throw "There were no changes to save";
      }

      const requestBody: TeamUpdateRequest = {
        teamName: teamState.teamName,
        members: {
          oldValue: teamMembers.map((member) => member.value),
          newValue: data.members,
        },
        polygonAddress: {
          oldValue: teamState.polygonAddress,
          newValue: data.polygonAddress,
        },
      };

      if (data.ethereumAddress || teamState.ethereumAddress) {
        requestBody.ethereumAddress = {
          oldValue: teamState.ethereumAddress,
          newValue: data.ethereumAddress || "",
        };
      }

      if (data.link || teamState.link) {
        requestBody.link = {
          oldValue: teamState.link || "",
          newValue: data.link || "",
        };
      }

      if (data.image) {
        requestBody.image = data.image;
      }

      return await fetch("/.netlify/functions/manage-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${sessionToken}`,
          "C4-User": currentUser.username,
        },
        body: JSON.stringify(requestBody),
      });
    },
    [teamState, teamMembers, currentUser]
  );

  return (
    <ProtectedPage
      pageTitle="Manage Team | Code 423n4"
      message="You need to be a registered warden, currently connected via wallet to manage a team."
    >
      <div className="limited-width">
        {unauthorized ? (
          <div className="centered-text">
            <div className="form">
              <h1>Unauthorized</h1>
              <p>You are not authorized to view or edit this team.</p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="page-header">
              Manage Team {teamState && `"${teamState?.teamName}"`}
            </h1>
            <TeamForm
              onSubmit={onSubmit}
              handles={handles}
              wardens={wardens}
              initialState={teamState}
              initialTeamMembers={teamMembers}
              submitButtonText="Save team"
              successMessage={
                <p>
                  Your changes have been submitted!
                  <br />
                  <strong>Please note: </strong>it may take a few business days
                  for your changes to take effect. You should get an email with
                  a link to track the progress of your changes.
                </p>
              }
            >
              <p>
                <strong>Heads up!</strong> Changes you make to your team are not
                immediately effective. It may take up a few business days for
                your changes to be reviewed and completed.
              </p>
            </TeamForm>
          </>
        )}
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
              resize(width: 80) {
                src
              }
            }
          }
        }
      }
    }
  }
`;
