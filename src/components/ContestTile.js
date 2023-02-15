import React, { useEffect, useState } from "react";
import { Link } from "gatsby";

import { getDates } from "../utils/time";

import ClientOnly from "./ClientOnly";
import Countdown from "./Countdown";
import SponsorLink from "./SponsorLink";

const ContestTile = ({ contest, updateContestStatus, user }) => {
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

  useEffect(() => {
    if (fields.codeAccess === "public") {
      setCanViewContest(true);
    } else if (fields.codeAccess === "certified" && user.isCertified) {
      setCanViewContest(true);
    } else {
      setCanViewContest(false);
    }
  }, [fields, user]);

  return (
    <article className={"contest-tile " + t.contestStatus}>
      <div className="contest-tile__left-side">
        <SponsorLink sponsor={sponsor} />
      </div>
      <div className="contest-tile__right-side">
        <div className="contest-tile__right-top">
          <div>
            <h2 className="contest-tile__title">{title}</h2>
            <p className="contest-tile__details">{details}</p>
            <ul className="contest-tile__time-wrapper">
              <li className="contest-tile__days-duration">
                {t.daysDuration} day contest
              </li>
              {t.contestStatus === "soon" || t.contestStatus === "active" ? (
                <li className="contest-tile__countdown">
                  <Countdown
                    state={t.contestStatus}
                    start={start_time}
                    end={end_time}
                    isPreview={findingsRepo === ""}
                    updateContestStatus={updateContestStatus}
                  />
                </li>
              ) : (
                <li className="contest-tile__dates">
                  Contest ran {t.startDay}-{t.endDay}
                </li>
              )}
            </ul>
          </div>
          {amount ? <p className="contest-tile__amount">{amount}</p> : null}
        </div>
        <div className="contest-tile__right-bottom">
          <div className="contest-tile__button-wrapper">
            <ClientOnly>
              <a
                href={fields?.contestPath || "/"}
                className="contest-tile__button"
              >
                {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
              </a>
              {t.contestStatus === "active" && contestRepo && canViewContest && (
                <a href={contestRepo} className="contest-tile__button">
                  View Repo
                </a>
              )}
              {(t.contestStatus === "active" || status === "Active Contest") &&
              findingsRepo &&
              fields.status &&
              fields.submissionPath &&
              canViewContest ? (
                <Link
                  to={fields.submissionPath}
                  className="contest-tile__button"
                >
                  Submit Finding
                </Link>
              ) : null}
            </ClientOnly>
          </div>
          <div className="contest-tile__status-indicator">
            <span className="contest-tile__status-indicator-text">Live</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ContestTile;
