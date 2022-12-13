import React from "react";

import Definitions from "../content/Definitions";
import TrustBar from "../TrustBar";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1>
        <span>Top auditors compete to </span> <span>keep high severity bugs</span>{" "}
        <span>out of production.</span>
      </h1>
      <h5>
        Start a public or private audit within 48 hours.
      </h5>
      <div class="hero-buttons">
        <a href="https://code4rena.typeform.com/i-want-an-audit" className="button button-small">
          I want an audit
        </a>
        <a href="https://discord.gg/code4rena" target="_blank" className="button button-small cta-button lowercase secondary">
          I want to be an auditor
        </a>
      </div>

      <TrustBar />

    </div>
  );
};

export default HeroIndex;
