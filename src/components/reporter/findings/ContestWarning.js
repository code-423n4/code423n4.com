import React from "react";

const ContestWarning = () => {
  return (
    <div className="form__info-blob">
      <span className="icon">👋</span>
      <p>
        Hi there! We've changed the way we are handling low risk, non-critical,
        and gas optimization findings. Please submit all low risk and non
        critical findings as one report, and gas optimization findings as
        another, separate report. Submissions for medium and high risk findings
        are not changing. Check out
        <a
          href="https://docs.code4rena.com/roles/wardens/judging-criteria"
          target="_blank"
          rel="noreferrer"
          aria-label="the docs (opens in a new window)"
        >
          {" "}
          the docs
        </a>{" "}
        and
        <a
          href="https://docs.code4rena.com/roles/wardens/qa-gas-report-faq"
          target="_blank"
          rel="noreferrer"
          aria-label="FAQ about QA and Gas Reports (opens in a new window)"
        >
          {" "}
          FAQ about QA and Gas Reports
        </a>{" "}
        for more details.
      </p>
    </div>
  );
};

export default ContestWarning;
