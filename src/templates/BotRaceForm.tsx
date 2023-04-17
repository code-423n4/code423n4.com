import { graphql, Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { isAfter } from "date-fns";
import { addHours } from "date-fns/esm";

// components
import ProtectedPage from "../components/ProtectedPage";
import SubmitBotFinding from "../components/reporter/SubmitBotFinding";

const ReportForm = ({ data }) => {
  const {
    findingsRepo,
    title,
    start_time,
    fields,
    contestid,
  } = data.contestsCsv;
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
  });

  return (
    <ProtectedPage pageTitle="Submit finding | Code4rena">
      <div className="limited-width">
        {hasBotRaceEnded ? (
          <>
            <h1>The Bot Race window has ended.</h1>
            <p>
              You can no longer submit bot race reports for this competition.
            </p>
            <Link to={fields.contestPath} className="button button--back-link">
              Back to {title} competition page
            </Link>
          </>
        ) : (
          <>
            <Link to={fields.contestPath} className="button button--back-link">
              Back to {title} competition page
            </Link>
            <SubmitBotFinding
              title={title}
              contestPath={fields.contestPath}
              contestNumber={parseInt(contestid)}
              // @todo: add bot findings repo to contest data
              botFindingsRepo={findingsRepo.replace(
                "-findings",
                "-bot-findings"
              )}
            />
          </>
        )}
      </div>
    </ProtectedPage>
  );
};

export default ReportForm;

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
