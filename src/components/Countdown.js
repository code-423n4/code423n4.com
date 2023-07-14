import React, { useEffect, useState } from "react";
import { getTimeRemaining, getDates } from "../utils/time";

const Countdown = ({
  start,
  end,
  isPreview,
  updateContestStatus,
  text = "",
}) => {
  const [contestTimer, setContestTimer] = useState(getDates(start, end));
  const [timeLeft, setTimeLeft] = useState(
    getTimeRemaining(contestTimer, true)
  );

  const type = isPreview ? "preview" : "contest";

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimer = getDates(start, end);
      setTimeLeft(getTimeRemaining(contestTimer));

      if (
        contestTimer.contestStatus !== newTimer.contestStatus ||
        contestTimer.botRaceStatus !== newTimer.botRaceStatus
      ) {
        setContestTimer(newTimer);
        if (updateContestStatus) {
          updateContestStatus();
        }
      }

      if (!timeLeft || timeLeft.total < 1000) {
        clearInterval(timer);
        return;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [start]);

  return (
    <div className="countdown">
      {text && text}
      <span className="wrapper-time">
        {contestTimer.contestStatus === "active" ? (
          <span className="countdown-live"></span>
        ) : null}
        <span className="days">{timeLeft.days}</span> days +{" "}
      </span>
      <span className="wrapper-time">
        <span className="hours">{timeLeft.hh}</span>
        {":"}
        <span className="minutes">{timeLeft.mm}</span>
        {":"}
        <span className="seconds">{timeLeft.ss}</span>
      </span>
    </div>
  );
};

export default Countdown;
