import React from "react";
import { Link } from "gatsby";
import { getDates } from "../utils/time";

import SponsorLink from "./SponsorLink";

const Report = ({ report }) => {
  const { slug, sponsor, contest, altUrl } = report;
  const { start_time, end_time } = contest;
  const t = getDates(start_time, end_time);
  const reportUrl = `/reports/${slug}`;

  return (
    <div className={"wrapper-contest " + t.state}>
      <SponsorLink sponsor={sponsor} />
      <div className="wrapper-contest-content">
        <h4>{sponsor.name}</h4>
        <p>
          {t.startDay} — {t.endDay}
        </p>

        {altUrl ? (
          <a
            href={altUrl}
            className="contest-repo button button-small cta-button"
          >
            Contest report
          </a>
        ) : (
          <Link
            to={reportUrl}
            className="contest-repo button button-small cta-button"
          >
            Contest report
          </Link>
        )}
      </div>
    </div>
  );
};

export default Report;
