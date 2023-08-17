import React from "react";
import { Link } from "gatsby";

const heroCTAButtons = {
  wardens: {
    primary: {
      text: "Become a Warden",
      link: "/register",
    },
    secondary: {
      text: "View leaderboard",
      link: "/leaderboard",
    },
  },
  projects: {
    primary: {
      text: "Get your project audited",
      link: "https://code4rena.typeform.com/i-want-an-audit",
    },
    secondary: {
      text: "See past reports",
      link: "/reports",
    },
  },
};

const HeroIndex = ({ viewMode }) => {
  return (
    <article className="hero">
      {!viewMode ||
        (viewMode === "project" && (
          <div className="hero__project type__copy grid__one-by-two--break-s limited-width">
            <div className="hero__left-side">
              <h1 className="type__headline__hero">
                <div>Secure your</div> <div>smart contracts.</div>
              </h1>
              <p>
                Top auditors compete to keep high severity bugs out of
                production. Start a public or private audit within 48 hours.
              </p>
              <div className="hero__buttons">
                <a
                  href={heroCTAButtons.projects.primary.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    heroCTAButtons.projects.primary.text +
                    " (Opens in a new window)"
                  }
                  className="button button--primary"
                >
                  {heroCTAButtons.projects.primary.text}
                </a>
                <Link
                  to={heroCTAButtons.projects.secondary.link}
                  className="button button--secondary"
                >
                  {heroCTAButtons.projects.secondary.text}
                </Link>
              </div>
            </div>
            <div className="hero__right-side type__copy">
              <div className="hero__statistic">
                <p className="type__headline__l hero__statistic-number">865</p>
                <p className="hero__statistic-unit hero__statistic-unit--short">
                  unique <br /> high-severity vulns
                </p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l hero__statistic-number">
                  18,660
                </p>
                <p className="hero__statistic-unit hero__statistic-unit--short">
                  unique findings
                </p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l hero__statistic-number">
                  4,830+
                </p>
                <p className="hero__statistic-unit hero__statistic-unit--short">
                  registered wardens
                </p>
              </div>
              <div className="hero__statistic">
                <p className="type__headline__l hero__statistic-number">225</p>
                <p className="hero__statistic-unit hero__statistic-unit--short">
                  audits completed
                </p>
              </div>
            </div>
          </div>
        ))}
      {viewMode === "warden" && (
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
              <Link
                to={heroCTAButtons.wardens.primary.link}
                className="button button--primary"
              >
                {heroCTAButtons.wardens.primary.text}
              </Link>

              <Link
                to={heroCTAButtons.wardens.secondary.link}
                className="button button--secondary"
              >
                {heroCTAButtons.wardens.secondary.text}
              </Link>
            </div>
          </div>
          <div className="hero__right-side type__copy">
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">$14m+</p>
              <p className="hero__statistic-unit">earned by wardens</p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">
                $71,500
              </p>
              <p className="hero__statistic-unit">
                <span>
                  2023 highest single <span className="no-break">payout</span>
                </span>
              </p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">$8,340</p>
              <p className="hero__statistic-unit">
                2023 avg payout per competition for top 3
              </p>
            </div>
            <div className="hero__statistic">
              <p className="type__headline__l hero__statistic-number">100%</p>
              <p className="hero__statistic-unit">
                <span>
                  of satisfactory{" "}
                  <span className="no-break">findings paid</span> out
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default HeroIndex;
