import React, { useEffect, useState } from "react";
import { getTimeRemaining, getDates } from "../utils/time";

const Countdown = ({ start, end }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const t = getDates(start, end);

  let tLeft;

  if (t.state === "soon") {
    tLeft = getTimeRemaining(start);
  }
  if (t.state === "active") {
    tLeft = getTimeRemaining(end);
  }

  return (
    <div className="countdown">
      <h5 className="wrapper-days">
        <span className="days">{tLeft.days}</span> days +{" "}
      </h5>
      <h5 className="wrapper-time">
        <span className="hours">{tLeft.hh}</span>{" "}
        <span className="minutes">{tLeft.mm}</span>{" "}
        <span className="seconds">{tLeft.ss}</span>
        {t.state === "soon" ? " until contest starts" : " until contests ends"}
      </h5>
    </div>
  );
};

export default Countdown;
