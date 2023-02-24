import React, { useEffect, useState } from "react";
import { getTimeRemaining, getDates } from "../utils/time";

const Countdown = ({
  start,
  end,
  isPreview,
  text = undefined,
  updateContestStatus = undefined,
}) => {
  const [contestTimer, setContestTimer] = useState(getDates(start, end));
  const [timeLeft, setTimeLeft] = useState(
    getTimeRemaining(contestTimer, true)
  );

  const type = isPreview ? "preview" : "contest";

  useEffect(() => {
    const timer = setTimeout(() => {
      setContestTimer(getDates(start, end));
      setTimeLeft(getTimeRemaining(contestTimer));

      if (timeLeft.total >= 1000) {
        return;
      } else {
        if (updateContestStatus) {
          updateContestStatus();
        }
        setTimeLeft(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown">
      <h5>
        <span className="wrapper-time">
          {contestTimer.contestStatus === "active" ? (
            <span className="countdown-live"></span>
          ) : null}
          <span className="days">{timeLeft.days}</span> days +{" "}
        </span>
        <span className="wrapper-time">
          <span className="hours">{timeLeft.hh}</span>{" "}
          <span className="minutes">{timeLeft.mm}</span>{" "}
          <span className="seconds">{timeLeft.ss}</span>
        </span>
        {text && timeLeft.total > 0 ? (
          <span className="wrapper-time end-cap">
            {contestTimer.contestStatus === "soon"
              ? ` until ${type} starts`
              : ` until ${type} ends`}
          </span>
        ) : null}
      </h5>
    </div>
  );
};

export default Countdown;
