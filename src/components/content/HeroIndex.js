import React from "react";
import Definitions from "../content/Definitions";

const HeroIndex = () => {
  return (
    <div className="hero">
      <h1>
        <span>C4 audit contests</span>{' '}
        <span>find more bugs faster</span>{' '}
        <span>than any other method.</span>
      </h1>
      <h5>
        Book an audit contest as soon as this month.
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
