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
    <div className={"wrapper-contest " + t.contestStatus}>
      <SponsorLink sponsor={sponsor} />
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
        {t.contestStatus !== "active" ? (
          <p className="days-duration">{t.daysDuration} day contest</p>
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
            className="contest-repo button button-small cta-button primary"
          >
            {`${findingsRepo === "" ? "Preview" : "View"} Contest`}
          </a>
          {t.contestStatus === "active" && contestRepo && canViewContest && (
            <a
              href={contestRepo}
              className="button button-small cta-button secondary"
            >
              View Repo
            </a>
          )}
          {/* {(t.contestStatus === "active" || status === "Active Contest") &&
          findingsRepo &&
          fields.status &&
          fields.submissionPath &&
          canViewContest ? ( */}
            <Link
              to={fields.submissionPath}
              className="button button-small cta-button secondary"
            >
              Submit Finding
            </Link>
          {/* // ) : (
          //   ""
          // )} */}/
        </ClientOnly>
      </div>
    </div>
  );
};

export default ContestTile;
