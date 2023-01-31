import React from "react";
import TrustBar from "../TrustBar";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

const HeroIndex = () => {
  return (
    <div className="hero type__copy">
      <h1 className="type__l-headline">Find bugs. Get paid.</h1>
      <p>
        Want to get paid for deploying your hacking abilities? You're in the
        right place. Code4rena competitive audits reward you for finding valid
        bugs, every time.
      </p>
      <div className="hero-buttons">
        <a
          href="https://code4rena.typeform.com/i-want-an-audit"
          target="_blank"
          rel="noreferrer"
          aria-label={primaryButtonText + " (Opens in a new window)"}
          className="button button-small"
        >
          {primaryButtonText}
        </a>
        <a
          href="https://discord.gg/code4rena"
          target="_blank"
          rel="noreferrer"
          aria-label={secondaryButtonText + " (Opens in a new window"}
          className="button button-small cta-button lowercase secondary"
        >
          {secondaryButtonText}
        </a>
      </div>

      <TrustBar />
    </div>
  );
};

export default HeroIndex;
