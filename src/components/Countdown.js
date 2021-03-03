import React, { useEffect, useState } from "react";

const getTimeRemaining = (endtime) => {
  const total = Date.parse(endtime) - Date.parse(new Date());
  if (total > 0) {
    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      seconds: Math.floor((total / 1000) % 60),
      minutes: Math.floor((total / 1000 / 60) % 60),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    };
  } else {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
};

const Countdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const t = getTimeRemaining(deadline);
  const days = t.days;
  const hh = ("0" + t.hours).slice(-2);
  const mm = ("0" + t.minutes).slice(-2);
  const ss = ("0" + t.seconds).slice(-2);

  return (
    <div className="countdown">
      <h5 className="wrapper-days">
        <span className="days">{days}</span> days +{" "}
      </h5>
      <h5 className="wrapper-time">
        <span className="hours">{hh}</span>{" "}
        <span className="minutes">{mm}</span>{" "}
        <span className="seconds">{ss}</span> left
      </h5>
    </div>
  );
};

export default Countdown;
