import React from "react";
import Countdown from "./Countdown";

const Contest = ({ contest }) => {
  const { sponsor, details, end_time } = contest;

  return (
    <div className="wrapper-contest">
      <div className="wrapper-sponsor">
        <a className="sponsor-logo" href={sponsor.link}>
          <img src={sponsor.image} alt={sponsor.name} />
        </a>
      </div>
      <div className="wrapper-contest-content">
        <h4>
          <a className="sponsor-name" href={sponsor.link}>
            {sponsor.name}
          </a>{" "}
          contest
        </h4>
        <Countdown deadline={end_time} />
        <p>{details}</p>
      </div>
    </div>
  );
};

export default Contest;
