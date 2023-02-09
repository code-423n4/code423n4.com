import React, { ReactNode } from "react";
import { Link } from "gatsby";

export interface SecondaryNavItem {
  to: string;
  text?: string;
  active?: boolean;
  children?: ReactNode;
}

export default function SecondaryNavItem({
  to,
  text,
  active,
  children,
}: SecondaryNavItem): JSX.Element {
  return (
    <Link to={to} className={(active ? "active " : "") + "secondary-nav__item"}>
      {children ? children : text ? text : "Link"}
    </Link>
  );
}
