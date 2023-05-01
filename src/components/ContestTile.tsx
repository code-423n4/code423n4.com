import React, { useCallback, useEffect, useState } from "react";
import { Link } from "gatsby";

import { ContestStatus, getDates } from "../utils/time";

import ClientOnly from "./ClientOnly";
import Countdown from "./Countdown";
import SponsorLink from "./SponsorLink";

const statusText = {
  active: "Live",
  soon: "Soon",
  completed: "Ended",
};

const ContestTile = ({ contest, updateContestStatus, user, reduced }) => {
  const {
    sponsor,
    title,
    amount,
    details,
    start_time,
    end_time,
    findingsRepo,
    repo: contestRepo,
    fields,
    status,
  } = contest;

  const [canViewContest, setCanViewContest] = useState(false);
  const [contestTimelineObject, setContestTimelineObject] = useState(
    getDates(start_time, end_time)
  );
  const hasBotRace = fields.codeAccess === "public";

  useEffect(() => {
    if (fields.codeAccess === "public") {
      setCanViewContest(true);
    } else if (fields.codeAccess === "certified" && user.isCertified) {
      setCanViewContest(true);
    } else {
      setCanViewContest(false);
    }
  }, [fields, user]);

  const updateContestTileStatus = useCallback(() => {
    updateContestStatus();
    const newTimelineObject = getDates(start_time, end_time);
    setContestTimelineObject(newTimelineObject);
  }, [start_time]);

  return (
    <div
      className={
        "contest-tile " + contestTimelineObject.contestStatus + " " + reduced
      }
    >
      <div className="contest-tile__top">
        <header className="contest-tile__content">
          <div className="contest-tile__logo">
            <SponsorLink sponsor={sponsor} size="90" />
          </div>
          <div className="contest-tile__details-wrapper">
            <h2 className="contest-tile__title">
              <Link
                to={fields?.contestPath || "/"}
                className="contest-tile__button"
              >
                {title}
              </Link>
            </h2>
            <p className="contest-tile__details">
              {details}
              {hasBotRace &&
                (contestTimelineObject.botRaceStatus === ContestStatus.Soon ||
                  contestTimelineObject.botRaceStatus ===
                    ContestStatus.Live) && (
                  <span className="contest-tile__bot-race-status">
                    <img src="/images/icon/wolf-bot/16.svg" className="icon" />
                    {contestTimelineObject.botRaceStatus ===
                      ContestStatus.Soon && <>1st hour: Bot Race</>}
                    {contestTimelineObject.botRaceStatus ===
                      ContestStatus.Live && <>Bot Race live</>}
                  </span>
                )}
            </p>
          </div>
        </header>
        {amount ? <p className="contest-tile__amount">{amount}</p> : null}
      </div>
      <ClientOnly>
        <footer className="contest-tile__bottom">
          <div className="contest-tile__status-indicator">
            <span
              className={
                "contest-tile__status-indicator-text contest-tile__status-indicator-text--" +
                contestTimelineObject.contestStatus
              }
            >
              {statusText[contestTimelineObject.contestStatus]}
            </span>
            {contestTimelineObject.contestStatus === "soon" ||
            contestTimelineObject.contestStatus === "active" ? (
              <span className="contest-tile__countdown">
                {contestTimelineObject.contestStatus === "active" && (
                  <span>Ends in</span>
                )}
                {contestTimelineObject.contestStatus === "soon" && (
                  <span>Starts in</span>
                )}
                <Countdown
                  start={start_time}
                  end={end_time}
                  isPreview={findingsRepo === ""}
                  updateContestStatus={updateContestTileStatus}
                />
              </span>
            ) : null}
          </div>

          <div className="contest-tile__button-wrapper">
            <Link
              to={fields?.contestPath || "/"}
              className="contest-tile__button"
            >
              {`${findingsRepo === "" ? "Preview" : "View"}`} competition
            </Link>
            {contestTimelineObject.contestStatus === "active" &&
              contestRepo &&
              canViewContest && (
                <a href={contestRepo} className="contest-tile__button">
                  View repo
                </a>
              )}
            {(contestTimelineObject.contestStatus === "active" ||
              status === "Active Contest") &&
            findingsRepo &&
            fields.status &&
            fields.submissionPath &&
            canViewContest &&
            (!hasBotRace ||
              contestTimelineObject.botRaceStatus === ContestStatus.Done) ? (
              <Link to={fields.submissionPath} className="contest-tile__button">
                Submit finding
              </Link>
            ) : null}
          </div>
        </footer>
      </ClientOnly>
    </div>
  );
};

export default ContestTile;
