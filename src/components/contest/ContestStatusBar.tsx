import { formatDistance } from "date-fns";
import { Link } from "gatsby";
import React from "react";

import {
  AbsoluteURL,
  ContestNumber,
  DateString,
  RelativeURL,
} from "../../../types/shared";
import { ContestSchedule, ContestStatus } from "../../utils/time";
import botRaceQualifier from "../../../_data/bot-race-qualifier.json";
import useUser from "../../hooks/UserContext";

import Countdown from "../Countdown";

const statusText = {
  active: "Live",
  soon: "Coming Soon",
  completed: "Ended",
};

interface ContestTimelineBarProps {
  contestTimelineObject: ContestSchedule;
  start_time: DateString;
  end_time: DateString;
  findingsRepo: AbsoluteURL;
  contestNumber: ContestNumber;
  botRacePath: RelativeURL;
  hasBotRace: boolean;
}

export default function ContestStatusBar({
  contestTimelineObject,
  start_time,
  end_time,
  findingsRepo,
  contestNumber,
  botRacePath,
  hasBotRace,
}: ContestTimelineBarProps) {
  const { currentUser } = useUser();

  const isQualifierLive = contestNumber === botRaceQualifier.contest;
  const hasEligibleBot = currentUser.bot && !currentUser.bot.relegated;

  let linkText = "Submit your bot race report";
  let linkTo = botRacePath;
  let botRaceMessage = "Bot Race is live!";
  if (isQualifierLive) {
    if (!hasEligibleBot) {
      botRaceMessage = "Bot Race Qualifier is live!";
      linkTo = "/register/bot";
    }
    if (!currentUser.bot) {
      linkText = "Register your bot";
    } else if (currentUser.bot.relegated) {
      linkText = "Apply for promotion";
    }
  }

  return (
    <div className="contest-page__status-bar">
      {contestTimelineObject.botRaceStatus === ContestStatus.Live &&
        hasBotRace && (
          <div className="contest-page__bot-race-status-bar">
            <span className="contest-page__bot-race-status-text">
              <img src="/images/icon/wolf-bot/16.svg" className="icon" />
              <strong>{botRaceMessage}</strong>
              &nbsp; Ends in{" "}
              {formatDistance(
                new Date(Date.now()),
                contestTimelineObject.botRaceEnd
              )}
            </span>
            <Link to={linkTo} className="button button--text-link">
              {linkText}
            </Link>
          </div>
        )}
      <div className="contest-page__top-bar">
        <span
          className={
            "contest-tile__status-indicator-text contest-tile__status-indicator-text--" +
            contestTimelineObject.contestStatus
          }
        >
          {statusText[contestTimelineObject.contestStatus]}
        </span>
        <span className="contest-tile__countdown">
          {contestTimelineObject.contestStatus === ContestStatus.Soon ? (
            <>
              <Countdown
                start={start_time}
                end={end_time}
                isPreview={findingsRepo === ""}
                text="Competition starts in "
              />
            </>
          ) : (
            <>
              <Countdown
                start={start_time}
                end={end_time}
                isPreview={findingsRepo === ""}
                text="Competition ends in "
              />
            </>
          )}
        </span>
      </div>
    </div>
  );
}
