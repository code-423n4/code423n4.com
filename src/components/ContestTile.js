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

  if (!canViewContest) {
    return null;
  } else {
    return (
      <>
        <article className={"contest-tile " + t.contestStatus}>
          <SponsorLink sponsor={sponsor} />
          <div className="contest-tile__right-side">
            <div className="contest-tile__right-top">
              <hgroup>
                <h2 className="contest-tile__title">{title}</h2>
                <p className="contest-tile__details">{details}</p>
              </hgroup>
              {amount ? <p>{amount}</p> : null}
            </div>
            <div className="contest-tile__right-bottom">
              <ul>
                {t.contestStatus === "soon" || t.contestStatus === "active" ? (
                  <li>
                    <Countdown
                      state={t.contestStatus}
                      start={start_time}
                      end={end_time}
                      isPreview={findingsRepo === ""}
                      updateContestStatus={updateContestStatus}
                    />
                  </li>
                ) : (
                  <li>
                    Contest ran {t.startDay}-{t.endDay}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </article>
        <article className={"contest-tile " + t.contestStatus}>
          <SponsorLink sponsor={sponsor} />
          {league === "cosmos" ? (
            <Link className="contest-tile__contest-league" to="/cosmos">
              Cosmos League
            </Link>
          ) : null}
          <h2 className="contest-tile__title">
            {amount ? amount : ""} {title}
          </h2>
          <p>{details}</p>
          {t.contestStatus !== "active" ? (
            <p className="contest-tile__days-duration">
              {t.daysDuration} day contest
            </p>
          ) : null}
          {t.contestStatus === "soon" || t.contestStatus === "active" ? (
            <Countdown
              state={t.contestStatus}
              start={start_time}
              end={end_time}
              isPreview={findingsRepo === ""}
              updateContestStatus={updateContestStatus}
            />
          ) : (
            <p>
              Contest ran {t.startDay}-{t.endDay}
            </p>
          )}
          <ClientOnly>
            <a
              href={fields?.contestPath || "/"}
              className="button button--primary"
            >
              {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
            </a>
            {t.contestStatus === "active" && contestRepo && canViewContest && (
              <a href={contestRepo} className="button button--secondary">
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
                className="button button--secondary"
              >
                Submit Finding
              </Link>
            ) : null}
          </ClientOnly>
        </article>
      </>
    );
  }
};

export default ContestTile;
