import React from "react";
import Report from "./Report";

const ReportList = ({ reports }) => {
  return (
    <>
      {reports.reverse().map((report) => (
        <Report report={report.node.frontmatter} key={report.node.id} />
      ))}
    </>
  );
};

export default ReportList;
