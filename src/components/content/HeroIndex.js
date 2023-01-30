import React from "react";
import TrustBar from "../TrustBar";

const auditButtonText = "I want an audit";
const auditorButtonText = "I want to be an auditor";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1 className="type__xl-headline">
        <span>Top auditors compete to </span>{" "}
        <span>keep high severity bugs</span> <span>out of production.</span>
      </h1>
      <h2 className="type__xs-headline">
        Start a public or private audit within 48 hours.
      </h2>
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
