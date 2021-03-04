import React from "react";
import Nav from "./Nav";

const HeroIndex = () => {
  return (
    <header>
      <Nav />
      <div className="hero">
        <h1>
          <span>Hack DeFi.</span> <span>Compete.</span> <span>Get paid.</span>
        </h1>
        <h5>
          We’re creating a community-driven approach to competitive smart
          contract audits. Join our open organization.
        </h5>
      </div>
    </header>
  );
};

export default HeroIndex;
