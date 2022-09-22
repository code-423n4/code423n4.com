import React from "react";

import Definitions from "../content/Definitions";
import TrustBar from "../TrustBar";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1>
        <span>C4 audit contests</span> <span>find more bugs faster</span>{" "}
        <span>than any other method.</span>
      </h1>
      <h5>
        Start your audit within 48 hours. Seriously.
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
