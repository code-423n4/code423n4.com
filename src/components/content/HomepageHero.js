import React from "react";
import SecondaryNav from "../SecondaryNav";
import SecondaryNavItem from "../SecondaryNavItem";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

const HeroIndex = () => {
  return (
    <div className="hero">
      <nav aria-labelledby="hero-navigation">
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
      <div className="hero__wardens type__copy grid__one-by-two--break-s">
        <div className="hero__left-side">
          <h1 className="type__hero-headline">
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
        <div className="hero__right-side">
          <div className="hero__statistic">
            <p className="type__m-headline">$140m</p>
            <p className="type__m-subheadline">Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__m-headline">$140m</p>
            <p className="type__m-subheadline">Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__m-headline">$140m</p>
            <p className="type__m-subheadline">Earned on-platform</p>
          </div>
          <div className="hero__statistic">
            <p className="type__m-headline">$140m</p>
            <p className="type__m-subheadline">Earned on-platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIndex;
