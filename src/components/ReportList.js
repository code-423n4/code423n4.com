import { differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";

import ReportTile from "./ReportTile";

function sortByReportDate(a, b) {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return differenceInDays(dateB, dateA);
}

const ReportList = ({ reports }) => {
  const [sortedReports, setSortedReports] = useState([]);

  useEffect(() => {
    // @todo: add new optional value in frontmatter for MR update
    // so that date value is consistent; then update this logic
    const updatedReports = reports
      .map((report) => {
        let publicationDate = "";
        if (
          report.node.frontmatter.date.includes(
            "Updated with Mitigation Review:"
          )
        ) {
          const newReportDate = report.node.frontmatter.date.split(
            "Updated with Mitigation Review: "
          )[1];
          publicationDate = newReportDate;
        } else {
          publicationDate = report.node.frontmatter.date;
        }
        return {
          ...report.node.frontmatter,
          date: publicationDate,
        };
      })
      .sort(sortByReportDate);
    setSortedReports(updatedReports);
  }, [reports]);
  return (
    <>
      {sortedReports.map((report) => (
        <ReportTile report={report} key={report.slug} />
      ))}
    </>
  );
};

export default ReportList;
