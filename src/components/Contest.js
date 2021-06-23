import React from "react";
import Countdown from "./Countdown";
import { getDates } from "../utils/time";

const Contest = ({ contest: { node } }) => {
  const {
    sponsor,
    title,
    amount,
    details,
    start_time,
    end_time,
    repo,
    findingsRepo,
    fields,
  } = node;
  const { submissionPath } = fields;

  const t = getDates(start_time, end_time);

  return (
    <div className={"wrapper-contest " + t.state}>
      <div className="wrapper-sponsor">
        <a href={sponsor.link}>
          <img
            src={sponsor.image.childImageSharp.resize.src}
            alt={sponsor.name}
          />
        </a>
      </div>
      <div className="wrapper-contest-content">
        <h4>
          {amount ? amount : ""} {title}
        </h4>
        <p>{details}</p>
        {t.state === "soon" || t.state === "active" ? (
          <Countdown state={t.state} start={start_time} end={end_time} isPreview={findingsRepo === ""} />
        ) : (
          <p>
            Contest ran {t.startDay}—{t.endDay}
          </p>
        )}
        {t.state === "active" && repo ? (
          <a
            href={repo}
            className="contest-repo button button-small cta-button"
          >
            {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
          </a>
        ) : (
          ""
        )}
        {t.state === "active" && findingsRepo && submissionPath ? (
          <a href={submissionPath} className="button button-small cta-button">
            Submit Finding
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Contest;
