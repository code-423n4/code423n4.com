import React, { ReactNode } from "react";

interface SecondaryNav {
  children: ReactNode;
}

const SecondaryNav = ({ children }) => {
  return (
    <div>
      {/* TODO finish this component. Make the nav have a name */}
      <nav
        className="secondary-nav type__copy limited-width"
        aria-labelledby="hero-navigation"
      >
        {/* This is for screenreaders to announce the secondary navigation */}
        <span id="hero-navigation" className="visually-hidden">
          Tab navigation
        </span>
        {children && children}
      </nav>
    </div>
  );
};

export default SecondaryNav;
