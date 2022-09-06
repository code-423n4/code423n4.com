import { graphql } from "gatsby";
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

  const [teamState, setTeamState] = useState<TeamState | undefined>();
  const [teamMembers, setTeamMembers] = useState<
    WardenFieldOption[] | undefined
  >();

  useEffect(() => {
    // @todo: show error message when user tries to manage a team they are not on
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
        console.log(teamData);
        console.log(teamData.paymentAddresses);
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
        const team = {
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
  }, [location]);

  const initializeState = (team: TeamInfo) => {
    const state: TeamState = {
      teamName: team.username,
      polygonAddress: team.polygonAddress || "",
      ethereumAddress: team.ethereumAddress || "",
      link: team.link,
      teamImage: team.image,
    };
    setTeamState(state);

    const members: WardenFieldOption[] = [];
    team.members.forEach((m) => {
      const member = wardens.find((warden) => warden.value === m);
      member && members.push(member);
    });
    setTeamMembers(members);
  };

  const handles: Set<string> = new Set(
    data.handles.edges.map((h) => h.node.handle)
  );

  let wardens: { value: string; image: unknown }[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  const onSubmit = useCallback(
    async (data: TeamCreateRequest, user) => {
      const sessionToken = user.attributes.sessionToken;
      if (!teamState || !teamMembers) {
        throw { error: "Missing old information" };
      }

      const requestBody: TeamUpdateRequest = {
        teamName: {
          oldValue: teamState.teamName,
          newValue: data.teamName,
        },
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
      <div className="wrapper-main">
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
            "Your changes have been submitted! " +
            "Please note: it may take up to 48 hrs for your changes to take effect. " +
            "You should get an email with a link to track the progress of your changes."
          }
        />
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
