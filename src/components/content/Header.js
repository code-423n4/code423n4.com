import React, { useState } from "react";
import { Link } from "gatsby";
import clsx from "clsx";
import Button from "../Button";

import useUser from "../../hooks/UserContext";

import Login from "../Login/Login";
import UserDropdown from "../Login/UserDropdown";

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
        height="22"
        viewBox="0 0 22 22"
        width="22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#d8d8d8" fillRule="evenodd">
          <rect className="top-bun" height="2" rx="1.5" width="22" />
          <rect className="patty" height="2" rx="1.5" width="22" y="9" />
          <rect className="bottom-bun" height="2" rx="1.5" width="22" y="18" />
        </g>
      </svg>
    </button>
  );
};

const Header = ({ hideConnectWalletDropdown = false }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { currentUser } = useUser();

  return (
    <header
      className={"header full-width--padded " + clsx(mobileNavOpen && "open")}
    >
      <a className="visually-hidden focusable skip-link" href="#skip-link">
        Skip Navigation
      </a>
      <nav
        className={"header__nav " + clsx(mobileNavOpen && "open")}
        role="navigation"
      >
        <div className="header__logo-and-burger">
          <Link className="logo" to="/">
            <img src="/images/c4-logo.svg" alt="Code4rena Logo" />
          </Link>
          <Hamburger
            setMobileNavOpen={setMobileNavOpen}
            mobileNavOpen={mobileNavOpen}
          />
        </div>
        <div className="header__nav-links">
          <Link to="/how-it-works">How it works</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/contests">Audits</Link>
          <Link to="/reports">Reports</Link>
          <a href="https://docs.code4rena.com">Docs</a>
          <Link to="/help">Help</Link>
          <div className="header__nav-buttons">
            {!hideConnectWalletDropdown &&
              (currentUser.isLoggedIn ? <UserDropdown /> : <Login />)}
          </div>
        </div>
      </nav>
      <span id="skip-link"></span>
    </header>
  );
};

export default Header;
