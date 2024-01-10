import React, { ReactNode } from "react";

interface ExternalLinkProps {
  to: string;
  alt?: string;
  children?: ReactNode;
}

export default function ExternalLink({
  to,
  alt,
  children,
}: ExternalLinkProps): JSX.Element {
  return (
    <a href={to} target="_blank" rel="noreferrer">
      {children ? children : alt}
      <span className="visually-hidden">Opens in a new window</span>
    </a>
  );
}
