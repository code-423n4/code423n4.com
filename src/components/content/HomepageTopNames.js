import { Link } from "gatsby";
import React from "react";

const topAuditors = [
  {
    name: "cmichel",
    link: "https://twitter.com/cmichelio",
  },
  {
    name: "leastwood",
    link: "https://twitter.com/0xleastwood",
  },
  {
    name: "hyh",
    link: "https://twitter.com/0xhyh",
  },
  {
    name: "gpersoon",
    link: "https://twitter.com/gpersoon",
  },
  {
    name: "gzeon",
    link: "https://twitter.com/gzeon",
  },
  {
    name: "hickuphh3",
    link: "https://twitter.com/HickupH",
  },
  {
    name: "cccz",
    link: null,
  },
  {
    name: "Lambda",
    link: null,
  },
  {
    name: "xiaoming90",
    link: "https://twitter.com/xiaoming9090",
  },
  {
    name: "hansfriese",
    link: "https://twitter.com/hansfriese",
  },
  {
    name: "Trust",
    link: "https://twitter.com/trust__90",
  },
  {
    name: "0xsomeone",
    link: "https://github.com/alex-ppg",
  },
  {
    name: "unforgiven",
    link: null,
  },
  {
    name: "HollaDieWaldfee",
    link: null,
  },
  {
    name: "Jeiwan",
    link: "https://jeiwan.net/",
  },
  {
    name: "0x52",
    link: null,
  },
  {
    name: "IllIllI",
    link: null,
  },
  {
    name: "bin2chen",
    link: "https://twitter.com/bin2chen",
  },
  {
    name: "0xA5DF",
    link: null,
  },
  {
    name: "akshaysrivastv",
    link: "https://twitter.com/akshaysrivastv",
  },
];

const HomepageTopNames = () => {
  return (
    <div className="hero__top-auditors full-width" data-nosnippet>
      <div className="limited-width">
        <h2 className="type__headline__m">
          Your journey to the top begins now.
        </h2>
        <p className="type__subline__s">Become one of the best.</p>
        <ul className="hero__top-auditors-list">
          {topAuditors.map((auditor) => (
            <li key={auditor.name} className="hero__top-auditor">
              {auditor.link ? (
                <a
                  href={auditor.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={auditor.name + " (Opens in a new window)"}
                  className="hero__top-auditor-name"
                >
                  <span className="hero__top-auditor-name--in-link">
                    {auditor.name}
                  </span>
                  <span className="hero__top-auditor-link-arrow">↗</span>
                </a>
              ) : (
                <span className="hero__top-auditor-name">{auditor.name}</span>
              )}
            </li>
          ))}
          <li>
            <Link to={"/register"} className="button button--secondary">
              Join us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomepageTopNames;
