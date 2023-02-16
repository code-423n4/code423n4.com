import React from "react";

import ReportTile from "./ReportTile";

function sortByContestId(a, b) {
  return (
    new Date(b.node.frontmatter.contest.start_time).getTime() -
    new Date(a.node.frontmatter.contest.start_time).getTime()
  );
}

const ReportList = ({ reports }) => {
  return (
    <>
      {reports.sort(sortByContestId).map((report) => (
        <ReportTile report={report.node.frontmatter} key={report.node.id} />
      ))}
    </>
  );
};

export default ReportList;
