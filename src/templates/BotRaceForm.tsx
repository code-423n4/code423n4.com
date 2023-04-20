import { graphql, Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { isAfter } from "date-fns";
import { addHours } from "date-fns/esm";

// components
import ProtectedPage from "../components/ProtectedPage";
import SubmitBotFinding from "../components/reporter/SubmitBotFinding";
import useUser from "../hooks/UserContext";

const BotRaceForm = ({ data }) => {
  const {
    findingsRepo,
    title,
    start_time,
    fields,
    contestid,
  } = data.contestsCsv;

  const { currentUser } = useUser();
  const [hasBotRaceEnded, setHasBotRaceEnded] = useState<boolean>(
    isAfter(new Date(Date.now()), addHours(new Date(start_time), 1))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const hasEnded = isAfter(
        new Date(Date.now()),
        addHours(new Date(start_time), 1)
      );
      if (hasEnded) {
        clearInterval(timer);
      }
      setHasBotRaceEnded(hasEnded);
    }, 1000);
    return () => clearInterval(timer);
  }, [start_time]);

  return (
    <ProtectedPage pageTitle="Submit finding | Code4rena">
      <div className="limited-width bot-race">
        <Link to={fields.contestPath} className="button button--back-link">
          Back to {title} competition page
        </Link>
        {hasBotRaceEnded ? (
          <>
            <h1>The Bot Race window has ended</h1>
            <p>
              You can no longer submit bot race reports for this competition.
            </p>
          </>
        ) : !currentUser.bot ? (
          <>
            <h1>Register your bot</h1>
            <p>
              To compete in a Bot Race, you'll need to have a registered bot.
              <br />
              Learn more on how to apply{" "}
              <Link to="/register/bot" className="button button--text-link">
                here.
              </Link>
            </p>
          </>
        ) : currentUser.bot.relegated ? (
          <>
            <h1>Your Bot is relegated</h1>
            <p>
              You can apply for promotion during the next qualifier race.{" "}
              <Link to="/register/bot" className="button button--text-link">
                Learn more.
              </Link>
            </p>
          </>
        ) : (
          <>
            <SubmitBotFinding
              title={title}
              contestNumber={parseInt(contestid)}
            />
          </>
        )}
      </div>
    </ProtectedPage>
  );
};

export default BotRaceForm;

export const pageQuery = graphql`
  query BotContestsById($contestId: Int) {
    contestsCsv(contestid: { eq: $contestId }) {
      title
      start_time
      findingsRepo
      contestid
      fields {
        contestPath
      }
    }
  }
`;
