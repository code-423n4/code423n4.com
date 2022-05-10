import React from "react";

import Definitions from "../content/Definitions";

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
          Say #i-want-to-be-a-sponsor in our Discord
        </a>
        <p>— or —</p>
        <a href="https://t.me/trebienxyz">
          Message us on Telegram
        </a>
      </h5>

      <Definitions />
    </div>
  );
};

export default HeroIndex;
