import React from "react";
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
          <a href="/cosmos">
            <div class="contest-league">
              <img src="/images/cosmos-icon.svg" alt="Cosmos Logo" />
              Cosmos League
            </div>
          </a>
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
            Contest ran {t.startDay}—{t.endDay}
          </p>
        )}
        {t.state === "active" && repo ? (
          <a
            href={contestPath}
            className="contest-repo button button-small cta-button primary"
          >
            {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
          </a>
        ) : (
          ""
        )}
        {/* <p>Status: {t.state}</p>
        <p>FindingsRepo: {findingsRepo}</p>
        <p>SubmissionPath: {submissionPath}</p>
        {t.state === "active" && findingsRepo && submissionPath ? ( */}
        {t.state === "active" && submissionPath ? (
          <a
            href={submissionPath}
            className="button button-small cta-button secondary"
          >
            Submit Finding
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContestTile;
