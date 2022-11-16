import React from "react";

import Report from "./Report";

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
        <Report report={report.node.frontmatter} key={report.node.id} />
      ))}
    </>
  );
};

export default ReportList;
