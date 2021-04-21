import React from "react";
import Countdown from "./Countdown";
import { getDates } from "../utils/time";

const Contest = ({ contest }) => {
  const {
    sponsor,
    title,
    amount,
    details,
    start_time,
    end_time,
    repo,
    wardens,
    judges,
  } = contest;

  const t = getDates(start_time, end_time);

  return (
    <div className={"wrapper-contest " + t.state}>
      <div className="wrapper-sponsor">
        <a href={sponsor.link}>
          <img src={sponsor.image} alt={sponsor.name} />
        </a>
      </div>
      <div className="wrapper-contest-content">
        <h4>
          {amount ? amount : ""} {title}
        </h4>
        <p>{details}</p>
        {t.state === "soon" || t.state === "active" ? (
          <Countdown state={t.state} start={start_time} end={end_time} />
        ) : (
          <p>
            Contest ran {t.startDay}—{t.endDay}
          </p>
        )}
        {t.state === "active" && repo ? (
          <a href={repo} className="contest-repo button cta-button">
            Contest details
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Contest;
