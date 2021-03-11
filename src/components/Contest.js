import React from "react";
import Countdown from "./Countdown";

const Contest = ({ contest }) => {
  const {
    sponsor,
    title,
    details,
    start_time,
    end_time,
    wardens,
    judges,
  } = contest;

  const now = new Date().getTime();
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();

  let state;
  if (now < start) {
    state = "soon";
  }
  if (now >= start && now <= end) {
    state = "active";
  }
  if (now > end) {
    state = "completed";
  }

  return (
    <div className={"wrapper-contest " + state}>
      <div className="wrapper-sponsor">
        <a className="sponsor-logo" href={sponsor.image}>
          <img src={sponsor.image} alt={sponsor.name} />
        </a>
      </div>
      <div className="wrapper-contest-content">
        <h4>{title}</h4>
        {state === "soon" || state === "active" ? (
          <Countdown state={state} start={start_time} end={end_time} />
        ) : (
          "ended"
        )}
        <p>{details}</p>
      </div>
    </div>
  );
};

export default Contest;
