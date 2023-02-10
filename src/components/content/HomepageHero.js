import React from "react";
import SecondaryNav from "../SecondaryNav";
import SecondaryNavItem from "../SecondaryNavItem";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

// Delete this when we have real data
// The way this is animated, adding more names makes it faster. We can make adjustments as needed once we finalize a number. We're not stuck with this few because that's how I wrote it initially.
// I made them objects so we can add more data later - 🍔

// const multiplyArray = (arr, length) => Array.from({ length }, () => arr).flat();
// const names = [
const topAuditors = [
  {
    name: "TwoReports",
  },
  {
    name: "perfectJo",
  },
  {
    name: "olivecomposer",
  },
  {
    name: "RustLady",
  },
  {
    name: "lunchbreak",
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
// const topAuditors = multiplyArray(names, 3);

// End delete

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
      <div className="hero__top-auditors__title-area full-width">
        <div className="limited-width">
          <h2 className="type__headline__s">
            Your journey as an auditor begins now
          </h2>
          <p className="type__subline__s">Become one of the best</p>
        </div>
      </div>

      <div className="hero__top-auditors__marquees full-width">
        <div class="marquee marquee--hover-pause">
          <ul className="hero__top-auditors-list marquee__content">
            {topAuditors.map((auditor) => (
              <li key={auditor.name} className="hero__top-auditor">
                <span className="hero__top-auditor-name">{auditor.name}</span>
              </li>
            ))}
          </ul>
          {/* the content needs to be repeated for the animation, but we need to hide it from screenreaders. Make sure to keep the aria-hidden during any changes to this component */}
          <ul
            aria-hidden="true"
            className="hero__top-auditors-list marquee__content"
          >
            {topAuditors.map((auditor) => (
              <li key={auditor.name} className="hero__top-auditor">
                <span className="hero__top-auditor-name">{auditor.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div class="marquee marquee--reverse marquee--hover-pause">
          <ul className="hero__top-auditors-list marquee__content">
            {topAuditors.map((auditor) => (
              <li key={auditor.name} className="hero__top-auditor">
                <span className="hero__top-auditor-name">{auditor.name}</span>
              </li>
            ))}
          </ul>
          {/* the content needs to be repeated for the animation, but we need to hide it from screenreaders. Make sure to keep the aria-hidden during any changes to this component */}
          <ul
            aria-hidden="true"
            className="hero__top-auditors-list marquee__content"
          >
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
