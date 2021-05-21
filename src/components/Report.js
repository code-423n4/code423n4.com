import React from "react";
import { getDates } from "../utils/time";

const Report = ({ report }) => {
  const {
    title,
    slug,
    url,
    date,
    sponsor,
    contest,
    hide,
    findings,
    altUrl,
  } = report;
  const { name, link, image } = sponsor;
  const { start_time, end_time, amount, details } = contest;
  const t = getDates(start_time, end_time);
  const reportUrl = `/reports/${slug}`;

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
        <h4>{sponsor.name}</h4>
        <p>
          {t.startDay} — {t.endDay} {t.endYear}
        </p>

        {altUrl ? (
          <a
            href={altUrl}
            className="contest-repo button button-small cta-button"
          >
            Contest report
          </a>
        ) : (
          <a
            href={reportUrl}
            className="contest-repo button button-small cta-button"
          >
            Contest report
          </a>
        )}
      </div>
    </div>
  );
};

export default Report;
