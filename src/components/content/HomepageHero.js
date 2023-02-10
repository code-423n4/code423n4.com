import React from "react";
import SecondaryNav from "../SecondaryNav";
import SecondaryNavItem from "../SecondaryNavItem";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

const topAuditors = [
  {
    name: "This section is in progress",
  },
  {
    name: "TwoReports",
  },
  {
    name: "perfectJo",
  },
  {
    name: "iParticipated",
  },
  {
    name: "0x0",
  },
  {
    name: "garfields",
  },
  {
    name: "0xTelemarketing",
  },
];

const HeroIndex = () => {
  return (
    <div className="hero">
      {/* TODO move this nav stuff into the component */}
      <nav aria-labelledby="hero-navigation" className="limited-width">
        {/* This is for screenreaders to announce the secondary navigation */}
        <span id="hero-navigation" className="visually-hidden">
          Banner navigation
        </span>
        <SecondaryNav>
          <SecondaryNavItem to="#wardens" active>
            For Wardens
          </SecondaryNavItem>
          <SecondaryNavItem to="#sponsors">For Sponsors</SecondaryNavItem>
        </SecondaryNav>
      </nav>
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
      <div className="hero__top-auditors full-width">
        <div className="limited-width">
          <h2 className="type__headline__s">
            Your journey as an auditor begins now
          </h2>
          <p className="type__subline__s">Become one of the best</p>
          <ul className="hero__top-auditors-list">
            {topAuditors.map((auditor) => (
              <li key={auditor.name} className="hero__top-auditor">
                <span className="hero__top-auditor-name">{auditor.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroIndex;
