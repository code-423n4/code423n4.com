import React from "react";
import TrustBar from "../TrustBar";

const auditButtonText = "I want an audit";
const auditorButtonText = "I want to be an auditor";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1>
        <span>Top auditors compete to </span>{" "}
        <span>keep high severity bugs</span> <span>out of production.</span>
      </h1>
      <h5>Start a public or private audit within 48 hours.</h5>
      <div className="hero-buttons">
        <a
          href="https://code4rena.typeform.com/i-want-an-audit"
          target="_blank"
          rel="noreferrer"
          aria-label={auditButtonText + " (Opens in a new window)"}
          className="button button-small"
        >
          {auditButtonText}
        </a>
        <a
          href="https://discord.gg/code4rena"
          target="_blank"
          rel="noreferrer"
          aria-label={auditorButtonText + " (Opens in a new window"}
          className="button button-small cta-button lowercase secondary"
        >
          {auditorButtonText}
        </a>
      </div>

      <TrustBar />
    </div>
  );
};

export default HeroIndex;
