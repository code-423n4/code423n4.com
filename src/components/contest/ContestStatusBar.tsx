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
}

export default function ContestStatusBar({
  contestTimelineObject,
  start_time,
  end_time,
  findingsRepo,
  contestNumber,
  botRacePath,
}: ContestTimelineBarProps) {
  const { currentUser } = useUser();

  return (
    <div>
      {contestTimelineObject.botRaceStatus === ContestStatus.Live &&
        (contestNumber === botRaceQualifier.contest &&
        (!currentUser.bot || currentUser.bot.relegated) ? (
          <>
            <span className="competition-tag--blurple">Bot Race Qualifier</span>
            <Link to="/register/bot" className="button button--text-link">
              {!currentUser.bot
                ? "Register your bot"
                : currentUser.bot.relegated
                ? "Your bot has been relegated - apply for promotion"
                : ""}
            </Link>
          </>
        ) : (
          <>
            <span>
              <img src="/images/icon/wolf-bot/16.svg" />{" "}
              <strong>Bot race live!</strong> Ends in{" "}
              {formatDistance(
                new Date(Date.now()),
                contestTimelineObject.botRaceEnd
              )}
            </span>
            <Link to={botRacePath} className="button button--text-link">
              Submit your bot race report
            </Link>
          </>
        ))}
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
