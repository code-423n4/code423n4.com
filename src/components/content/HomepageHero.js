import React from "react";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

const HeroIndex = () => {
  return (
    <div className="hero">
      <div className="hero__wardens type__copy grid__one-by-two--break-s limited-width">
        <div className="hero__left-side">
          <h1 className="type__headline__hero">
            <div>Find bugs.</div>
            <div>Get paid.</div>
          </h1>
          <p>
            Want to get paid for deploying your hacking abilities? You're in the
            right place. Code4rena competitive audits reward you for finding
            valid bugs, every time.
          </p>
          {/* TODO: these links are wrong */}
          <div className="hero__buttons">
            <a
              href="https://code4rena.typeform.com/i-want-an-audit"
              target="_blank"
              rel="noreferrer"
              aria-label={primaryButtonText + " (Opens in a new window)"}
              className="button button--primary"
            >
              {primaryButtonText}
            </a>
            <a
              href="https://discord.gg/code4rena"
              target="_blank"
              rel="noreferrer"
              aria-label={secondaryButtonText + " (Opens in a new window"}
              className="button button--secondary"
            >
              {secondaryButtonText}
            </a>
          </div>
        </div>
        {/* TODO: these stats are wrong */}
        <div className="hero__right-side type__copy">
          <div className="hero__statistic">
            <p className="type__headline__m">$140m</p>
            <p>Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__headline__m">$140m</p>
            <p>Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__headline__m">$140m</p>
            <p>Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__headline__m">$140m</p>
            <p>Earned on-platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIndex;
