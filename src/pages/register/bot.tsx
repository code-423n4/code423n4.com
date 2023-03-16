import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";

import ProtectedPage from "../../components/ProtectedPage";
import BotRegistrationForm from "../../components/BotRegistrationForm";
import { WardenFieldOption } from "../../components/reporter/widgets/WardenField";
import { format, isAfter, isBefore } from "date-fns";

// @todo: replace with correct start and end times
const START = new Date("2023-03-16T20:43:00.000Z");
const END = new Date("2023-03-16T20:44:30.000Z");

enum Status {
  soon,
  open,
  closed,
}

function getRegistrationWindowStatus(): Status {
  const now = Date.now();
  if (isAfter(now, END)) {
    return Status.closed;
  } else if (isBefore(now, END) && isAfter(now, START)) {
    return Status.open;
  } else {
    return Status.soon;
  }
}

export default function TeamRegistration({ data }) {
  const [
    registrationWindowStatus,
    setRegistrationWindowStatus,
  ] = useState<Status>(getRegistrationWindowStatus());

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
      const currentStatus = getRegistrationWindowStatus();

      if (currentStatus === Status.closed) {
        clearInterval(timer);
      }
      setRegistrationWindowStatus(currentStatus);
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <ProtectedPage
      pageTitle="Bot Application | Code4rena"
      message="You need to be a registered warden, currently connected via wallet to register a bot."
    >
      <div className="limited-width">
        {registrationWindowStatus === Status.open && (
          <>
            <h1>Register a Bot</h1>
            <BotRegistrationForm handles={handles} wardens={wardens} />
          </>
        )}
        {registrationWindowStatus === Status.closed && (
          <>
            <h1>Bot Registration is Closed</h1>
            <p>
              The first registration window for Bot Races has now closed. Keep
              your eye on our{" "}
              <a
                href=""
                rel="noreferrer"
                aria-label="Discord announcements channel (Opens in a new window)"
              >
                announcements channel in Discord
              </a>{" "}
              to learn when the next one will be.
            </p>
          </>
        )}
        {registrationWindowStatus === Status.soon && (
          <>
            <h1>Bot Registration Coming Soon...</h1>
            <p>
              The first registration window for Bot Races will open for one hour
              on {format(START, "d MMMM")} from {format(START, "h:mm")} to{" "}
              {format(END, "h:mm a")}
            </p>
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
