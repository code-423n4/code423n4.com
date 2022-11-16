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
        <a href="https://discord.gg/code4rena" className="button button-small">
          Join #i-want-an-audit in Discord
        </a>
        <p className="hero-or">or</p>
        <a href="https://t.me/trebienxyz" className="button button-small">
          Message us on Telegram
        </a>
      </h5>
      <TrustBar />

    </div>
  );
};

export default HeroIndex;
