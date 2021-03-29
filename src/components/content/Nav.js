import React from "react";
import { Link } from "gatsby";

const Nav = () => {
  return (
    <div className="wrapper-nav">
      <Link className="logo" to="/">
        <img src="/images/C4-banner.png" alt="Code 423n4" />
      </Link>
      <nav>
        <Link to="/leaderboard">Leaderboard</Link>
        <a href="https://github.com/code-423n4/code-contests/blob/main/SPONSOR_INFO.md">
          Sponsor
        </a>
        <a href="https://discord.gg/EY5dvm3evD">Join</a>
      </nav>
    </div>
  );
};

export default Nav;
