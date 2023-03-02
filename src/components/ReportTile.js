import React from "react";
import format from "date-fns-tz/format";
import { Link } from "gatsby";
import { getDates } from "../utils/time";

import SponsorLink from "./SponsorLink";

const ReportTile = ({ report }) => {
  const { slug, sponsor, contest, altUrl } = report;
  const { start_time, end_time } = contest;
  if (!start_time || !end_time || !report.date || report.date === "") {
    return <></>;
  }
  const t = getDates(start_time, end_time);
  if (t.startDay === "" || t.endDay === "") {
    return <></>;
  }
  const reportUrl = `/reports/${slug}`;
  console.log("<<<<<>>>>>", sponsor)
  console.log('data')
  console.log(t.startDay, t.endDay, report.date)
  console.log('data with new date')
  console.log(new Date(t.startDay), new Date(t.endDay), new Date(report.date));
  console.log('data with new date and format')
  console.log(
    format(new Date(t.startDay), "d MMM yyyy"),
    format(new Date(t.endDay), "d MMM yyyy"),
    format(new Date(report.date), "d MMM yyyy")
  );
  console.log("====================================")
  return (
    <div className={"report-tile"}>
      <div className="report-tile__content-wrapper">
        <SponsorLink sponsor={sponsor} className="report-tile__project-link" />
        <div className="report-tile__content">
          <h2 className="report-tile__project-name type__headline__xs">
            <Link to={reportUrl}>{sponsor.name} →</Link>
          </h2>
          <p>
            {format(new Date(t.startDay), "d MMM yyyy")}
            {" - "}
            {format(new Date(t.endDay), "d MMM yyyy")}
          </p>
        </div>
      </div>
      <footer className="report-tile__footer">
        {report.date && (
          <p className="report-tile__published">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g data-name="323-Document" id="_323-Document">
                <polygon
                  className="svg"
                  points="10 1 4 7 4 31 28 31 28 1 10 1"
                />
                <polyline className="cls-1" points="10 1 10 7 4 7" />
                <line className="cls-1" x1="8" x2="24" y1="15" y2="15" />
                <line className="cls-1" x1="8" x2="24" y1="20" y2="20" />
                <line className="cls-1" x1="8" x2="24" y1="25" y2="25" />
              </g>
            </svg>
            {format(new Date(report.date), "d MMM yyyy")}
          </p>
        )}
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
