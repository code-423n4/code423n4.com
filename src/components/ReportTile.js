import React from "react";
import { Link } from "gatsby";
import { getDates } from "../utils/time";

import SponsorLink from "./SponsorLink";

const ReportTile = ({ report }) => {
  const { slug, sponsor, contest, altUrl } = report;
  const { start_time, end_time } = contest;
  const t = getDates(start_time, end_time);
  const reportUrl = `/reports/${slug}`;

  return (
    <div className={"report-tile"}>
      <div className="report-tile__content-wrapper">
        <SponsorLink sponsor={sponsor} className="report-tile__sponsor-link" />
        <div className="report-tile__content">
          <h2 className="report-tile__sponsor-name type__headline__xs">
            {sponsor.name}
          </h2>
          <p>
            {t.startDay} — {t.endDay}
          </p>
        </div>
      </div>
      <footer className="report-tile__footer">
        {altUrl ? (
          <a href={altUrl} className="report-tile__report-link" target="_blank">
            View report (external)
          </a>
        ) : (
          <Link to={reportUrl} className="report-tile__report-link">
            View report
          </Link>
        )}
      </footer>
    </div>
  );
};

export default ReportTile;
