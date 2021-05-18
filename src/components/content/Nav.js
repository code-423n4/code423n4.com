import React from "react";
import { Link } from "gatsby";

const Nav = () => {
  return (
    <div className="wrapper-nav">
      <Link className="logo" to="/">
        <img src="/images/C4-banner.png" alt="Code 423n4" />
      </Link>
      <nav>
        <Link to="/reports">Reports</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/compete">Compete</Link>
        <Link to="/sponsor">Sponsor</Link>
      </nav>
    </div>
  );
};

export default Nav;
