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
        <br />
        <a href="https://code4rena.typeform.com/i-want-an-audit" className="button button-small">
          I want an audit
        </a>
      </h5>
      <TrustBar />

    </div>
  );
};

export default HeroIndex;
