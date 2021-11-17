import React from "react";
import Definitions from "../content/Definitions";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1>
        The future of audits
        <br />
        is decentralized.
      </h1>
      <h5>
        Book an audit contest as soon as this month.
        <br />
        <br />
        <a href="https://discord.gg/code4rena" className="button button-small">
          Join our Discord
        </a>
      </h5>

      <Definitions />
    </div>
  );
};

export default HeroIndex;
