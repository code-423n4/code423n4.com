import React, { ReactNode } from "react";

interface SecondaryNav {
  children: ReactNode;
}

const SecondaryNav = ({ children }) => {
  return <div className="secondary-nav type__copy">{children && children}</div>;
};

export default SecondaryNav;
