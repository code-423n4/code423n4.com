import React from "react";
import { Link } from "gatsby";

import { getDates } from "../utils/time";

import ClientOnly from "./ClientOnly";
import Countdown from "./Countdown";
import SponsorLink from "./SponsorLink";

const ContestTile = ({ contest }) => {
  // const {
  //   sponsor,
  //   title,
  //   league,
  //   amount,
  //   details,
  //   start_time,
  //   end_time,
  //   findingsRepo,
  //   repo: contestRepo,
  //   fields,
  // } = contest;

  // if (    
  //   !sponsor ||
  //   !title ||
  //   !league ||
  //   !amount ||
  //   !details ||
  //   !start_time ||
  //   !end_time ||
  //   !findingsRepo ||
  //   !contestRepo ||
  //   !fields) {
  //     console.log(contest.details)
  //   }
  const t = getDates(contest.start_time, contest.end_time);

  return (
    <div className={"wrapper-contest " + t.contestStatus}>
      <SponsorLink sponsor={sponsor} />
      <div className="wrapper-contest-content">
        {contest.league === "cosmos" ? (
          <Link to="/cosmos">
            <div className="contest-league">
              <img src="/images/cosmos-icon.svg" alt="Cosmos Logo" />
              Cosmos League
            </div>
          </Link>
        ) : (
          ""
        )}
        <h4>
          {contest.amount ? contest.amount : ""} {contest.title || ''}
        </h4>
        <p>{contest.details || ''}</p>
        {t.contestStatus !== "active" ? (
          <p className="days-duration">{t.daysDuration} day contest</p>
        ) : null}
        {t.contestStatus === "soon" || t.contestStatus === "active" ? (
          <Countdown
            state={t.contestStatus}
            start={contest.start_time}
            end={contest.end_time}
            isPreview={contest.findingsRepo === ""}
            updateContestStatus={null}
          />
        ) : (
          <p>
            Contest ran {t.startDay}-{t.endDay}
          </p>
        )}
        <ClientOnly>
          <Link
            to={contest.fields?.contestPath || '/'}
            className="contest-repo button button-small cta-button primary"
          >
            {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
          </Link>
          {t.contestStatus === "active" && contestRepo && (
            <Link
              to={contest.contestRepo}
              className="button button-small cta-button secondary"
            >
              View Repo
            </Link>
          )}
          {t.contestStatus === "active" && findingsRepo && fields.submissionPath ? (
            <Link
              to={contest.fields.submissionPath}
              className="button button-small cta-button secondary"
            >
              Submit Finding
            </Link>
          ) : (
            ""
          )}
        </ClientOnly>
      </div>
    </div>
  );
};

export default ContestTile;
