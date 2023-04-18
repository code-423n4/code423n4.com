import React, { useEffect, useState } from "react";
import { Link } from "gatsby";

import { getDates } from "../utils/time";

import ClientOnly from "./ClientOnly";
import Countdown from "./Countdown";
import SponsorLink from "./SponsorLink";
import { format } from "date-fns";

const ContestTile = ({ contest, updateContestStatus, user, reduced }) => {
  const {
    sponsor,
    title,
    league,
    amount,
    details,
    start_time,
    end_time,
    findingsRepo,
    repo: contestRepo,
    fields,
    status,
  } = contest;
  const t = getDates(start_time, end_time);
  const [canViewContest, setCanViewContest] = useState(false);
  const [contestStatusIndicator, setContestStatusIndicator] = useState(status);

  useEffect(() => {
    if (fields.codeAccess === "public") {
      setCanViewContest(true);
    } else if (fields.codeAccess === "certified" && user.isCertified) {
      setCanViewContest(true);
    } else {
      setCanViewContest(false);
    }
  }, [fields, user]);

  const statusText = {
    active: "Live",
    soon: "Soon",
    completed: "Ended",
  };

  return (
    <div className={"contest-tile " + t.contestStatus + " " + reduced}>
      <div className="contest-tile__top">
        <header className="contest-tile__content">
          <div className="contest-tile__logo">
            <SponsorLink sponsor={sponsor} size="90" />
          </div>
          <div className="contest-tile__details-wrapper">
            <h2 className="contest-tile__title">
              <Link
                to={fields?.contestPath || "/"}
                className="contest-tile__button"
              >
                {title}
              </Link>
            </h2>
            <p className="contest-tile__details">{details}</p>
          </div>
        </header>
        {amount ? <p className="contest-tile__amount">{amount}</p> : null}
      </div>
      <ClientOnly>
        <footer className="contest-tile__bottom">
          <div className="contest-tile__status-indicator">
            <span
              className={
                "contest-tile__status-indicator-text contest-tile__status-indicator-text--" +
                t.contestStatus
              }
            >
              {statusText[t.contestStatus]}
            </span>
            {t.contestStatus === "soon" || t.contestStatus === "active" ? (
              <span className="contest-tile__countdown">
                {t.contestStatus === "active" && <span>Ends in</span>}
                {t.contestStatus === "soon" && <span>Starts in</span>}
                <Countdown
                  start={start_time}
                  end={end_time}
                  isPreview={findingsRepo === ""}
                  updateContestStatus={updateContestStatus}
                />
              </span>
            ) : null}
          </div>

          <div className="contest-tile__button-wrapper">
            <Link
              to={fields?.contestPath || "/"}
              className="contest-tile__button"
            >
              {`${findingsRepo === "" ? "Preview" : "View"}`} competition
            </Link>
            {t.contestStatus === "active" && contestRepo && canViewContest && (
              <a href={contestRepo} className="contest-tile__button">
                View repo
              </a>
            )}
            {(t.contestStatus === "active" || status === "Active Contest") &&
            findingsRepo &&
            fields.status &&
            fields.submissionPath &&
            canViewContest ? (
              <Link to={fields.submissionPath} className="contest-tile__button">
                Submit finding
              </Link>
            ) : null}
          </div>
        </footer>
      </ClientOnly>
    </div>
  );
};

export default ContestTile;
