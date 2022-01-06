import React from "react";
import { Link } from "gatsby";
import Countdown from "./Countdown";
import { getDates } from "../utils/time";

const ContestTile = ({ contest: { node } }) => {
  const {
    sponsor,
    title,
    league,
    amount,
    details,
    start_time,
    end_time,
    repo,
    findingsRepo,
    fields,
  } = node;
  const { submissionPath, contestPath } = fields;

  const t = getDates(start_time, end_time);
  let now = new Date().getTime();
  const end = new Date(end_time).getTime();

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
        {league === "cosmos" ? (
          <Link to="/cosmos">
            <div className="contest-league">
              <img src="/images/cosmos-icon.svg" alt="Cosmos Logo" />
              Cosmos League
            </div>
          </Link>
        ) : (
          ""
        )}
        <h4>
          {amount ? amount : ""} {title}
        </h4>
        <p>{details}</p>
        {t.state !== "active" ? (
          <p className="days-duration">{t.daysDuration} day contest</p>
        ) : null}
        {t.state === "soon" || t.state === "active" ? (
          <Countdown
            state={t.state}
            start={start_time}
            end={end_time}
            isPreview={findingsRepo === ""}
          />
        ) : (
          <p>
            Contest ran {t.startDay}-{t.endDay}
          </p>
        )}
        <Link
          to={contestPath}
          className="contest-repo button button-small cta-button primary"
        >
          {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
        </Link>
        {t.state === "active" && findingsRepo && submissionPath && (end - now >= 0) ? (
          <Link
            to={submissionPath}
            className="button button-small cta-button secondary"
          >
            Submit Finding
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContestTile;
