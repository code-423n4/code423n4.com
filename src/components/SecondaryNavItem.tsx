import React, { ReactNode } from "react";

export interface SecondaryNavItem extends React.HTMLProps<HTMLButtonElement> {
  to: string;
  text?: string;
  active?: boolean;
  children?: ReactNode;
}

export default function SecondaryNavItem(props): JSX.Element {
  const { to, text, active, children } = props;
  return (
    <button
      {...props}
      active={active ? "true" : "false"}
      className={(active ? "active " : "") + "secondary-nav__item"}
    >
      {children ? children : text ? text : "Link"}
    </button>
  );
}
