import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";

import ProtectedPage from "../../components/ProtectedPage";
import BotRegistrationForm from "../../components/BotRegistrationForm";
import { WardenFieldOption } from "../../components/reporter/widgets/WardenField";
import { isAfter, isBefore } from "date-fns";

// @todo: replace with correct start and end times
const START = new Date("2023-03-16T20:43:00.000Z");
const END = new Date("2023-03-16T20:44:30.000Z");

export default function TeamRegistration({ data }) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handles: Set<string> = new Set([
    ...data.handles.edges.map((h) => h.node.handle),
    ...data.bots.edges.map((b) => b.node.handle),
  ]);

  let wardens: WardenFieldOption[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      if (isAfter(now, END)) {
        setIsRegistrationOpen(false);
        clearInterval(timer);
      } else if (isBefore(now, END) && isAfter(now, START)) {
        setIsRegistrationOpen(true);
      } else {
        setIsRegistrationOpen(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <ProtectedPage
      pageTitle="Bot Application | Code4rena"
      message="You need to be a registered warden, currently connected via wallet to register a bot."
    >
      <div className="limited-width">
        {isRegistrationOpen ? (
          <>
            <h1>Register a Bot</h1>
            <BotRegistrationForm handles={handles} wardens={wardens} />
          </>
        ) : (
          <p>Bot registration is closed</p>
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
        }
      }
    }
    bots: allBotsJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
