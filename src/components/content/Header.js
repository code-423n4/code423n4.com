import React, { useState } from "react";
import { Link } from "gatsby";
import clsx from "clsx";

import useUser from "../../hooks/UserContext";

import Login from "../Login/Login";
import UserDropdown from "../Login/UserDropdown";

import * as styles from "./Header.module.scss";

const Hamburger = ({ mobileNavOpen, setMobileNavOpen }) => {
  const ariaLabelContent = mobileNavOpen ? "Close menu" : "Open menu";

  return (
    <button
      className="hamburger"
      onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
      aria-label={ariaLabelContent}
      aria-expanded={mobileNavOpen}
    >
      <svg
        height="21"
        viewBox="0 0 28 21"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#d8d8d8" fillRule="evenodd">
          <rect className="top-bun" height="3" rx="1.5" width="28" />
          <rect className="patty" height="3" rx="1.5" width="28" y="9" />
          <rect className="bottom-bun" height="3" rx="1.5" width="28" y="18" />
        </g>
      </svg>
    </button>
  );
};

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { currentUser } = useUser();

  return (
    <header className={clsx(mobileNavOpen && "open")}>
      <a className="visually-hidden focusable skip-link" href="#skip-link">
        Skip Navigation
      </a>
      <nav className={clsx(mobileNavOpen && "open")} role="navigation">
        <Link className="logo" to="/">
          <img src="/images/c4-logo.svg" alt="Code 423n4" />
        </Link>
        <Hamburger
          setMobileNavOpen={setMobileNavOpen}
          mobileNavOpen={mobileNavOpen}
        />
        <div className="nav-links">
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/contests">Contests</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/cosmos">Cosmos</Link>
          <a href="https://docs.code4rena.com">Docs</a>
          <Link to="/help">Help</Link>
          {currentUser.isLoggedIn ? (
            <UserDropdown />
          ) : (
            <>
              <Login />
              <Link
                to="/register"
                className={clsx(styles.Register, "button cta-button")}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <span id="skip-link"></span>
    </header>
  );
};

export default Header;
