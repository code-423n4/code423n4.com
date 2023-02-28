import React from "react";
import { Link } from "gatsby";

const primaryButtonText = "Get started";
const secondaryButtonText = "View leaderboard";

const primaryButtonTextSponsor = "Get started";
const secondaryButtonTextSponsor = "Join our Discord";

const HeroIndex = ({ viewMode }) => {
  return (
    <div className="hero">
      {!viewMode ||
        (viewMode === "warden" && (
          <div className="hero__wardens type__copy grid__one-by-two--break-s limited-width">
            <div className="hero__left-side">
              <h1 className="type__headline__hero">
                <div>Find bugs.</div>
                <div>Get paid.</div>
              </h1>
              <p>
                Auditors compete for a share of the prize pool. The rarer your
                findings, the more you get paid.
              </p>
              <div className="hero__buttons">
                <Link to={"/register"} className="button button--primary">
                  {primaryButtonText}
                </Link>

                <Link to={"/leaderboard"} className="button button--secondary">
                  {secondaryButtonText}
                </Link>
              </div>
            </div>
            <div className="hero__right-side type__copy">
              <div className="hero__statistic">
                <p className="type__headline__l">$14.5m</p>
                <p>Earned by Wardens</p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l">17,340</p>
                <p>Unique vulnerabilities discovered</p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l">$9860.77</p>
                <p>Avg contest payout for top 3 (2023)</p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l">100%</p>
                <p>Of satisfactory paid out</p>
              </div>
            </div>
          </div>
        ))}
      {viewMode === "sponsor" && (
        <div className="hero__sponsor type__copy grid__one-by-two--break-s limited-width">
          <div className="hero__left-side">
            <h1 className="type__headline__hero">
              <div>Secure your</div> <div>smart contracts.</div>
            </h1>
            <p>
              Top auditors compete to keep high severity bugs out of production.
              Start a public or private audit within 48 hours.
            </p>
            {/* TODO: these links are wrong */}
            <div className="hero__buttons">
              <a
                href="https://code4rena.typeform.com/i-want-an-audit"
                target="_blank"
                rel="noreferrer"
                aria-label={
                  primaryButtonTextSponsor + " (Opens in a new window)"
                }
                className="button button--primary"
              >
                {primaryButtonTextSponsor}
              </a>
              <a
                href="https://discord.gg/code4rena"
                target="_blank"
                rel="noreferrer"
                aria-label={
                  secondaryButtonTextSponsor + " (Opens in a new window)"
                }
                className="button button--secondary"
              >
                {secondaryButtonTextSponsor}
              </a>
            </div>
          </div>
          <div className="hero__right-side type__copy">
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">
                $5 billion+
              </p>
              <p className="hero__unit">
                Assets secured via <span className="no-break">C4 audits</span>
              </p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">217</p>
              <p className="hero__unit">Audits run</p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">3,215+</p>
              <p className="hero__unit">Wardens</p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">803</p>
              <p className="hero__unit">High-severity vulnerabilities found</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroIndex;
