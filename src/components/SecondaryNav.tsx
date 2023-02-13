import React, { ReactNode } from "react";

interface SecondaryNav {
  children: ReactNode;
}

const SecondaryNav = ({ children }) => {
  return (
    <div>
      {/* TODO move this nav stuff into the component */}
      <nav
        className="secondary-nav type__copy"
        aria-labelledby="hero-navigation"
        className="limited-width"
      >
        {/* This is for screenreaders to announce the secondary navigation */}
        <span id="hero-navigation" className="visually-hidden">
          Banner navigation
        </span>
        {children && children}
      </nav>
    </div>
  );
};

export default SecondaryNav;
