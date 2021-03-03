import React from "react";
import { Link } from "gatsby";

const Nav = () => {
  return (
    <div className="wrapper-nav">
      <a className="logo" href="/">
        <img src="/images/C4-banner.png" alt="Code 423n4" />
      </a>
      <nav>
        <a href="https://github.com/code-423n4/code-contests">Compete</a>
        <a href="https://github.com/code-423n4/code-contests/blob/main/SPONSOR_INFO.md">
          Sponsor
        </a>
        <a href="https://discord.gg/EY5dvm3evD">Join</a>
      </nav>
    </div>
  );
};

export default Nav;
