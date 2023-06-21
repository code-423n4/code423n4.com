import React, { ReactNode } from "react";
import { Link } from "gatsby";

interface ButtonProps {
  to: string;
  buttonType?: string;
  text?: string;
  children?: ReactNode;
  // isDisabled?: boolean; // TODO: Implement this
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  text,
  to,
  buttonType,
  children,
  // isDisabled,
  icon,
  iconPosition,
}: ButtonProps): JSX.Element {
  return (
    <Link to={to} className={buttonType ? buttonType : "button--primary"}>
      {icon && iconPosition === "left" && icon}
      {children ? children : text ? text : "Button"}
      {icon && iconPosition === "right" && icon}
    </Link>
  );
}
