import React, { ReactNode } from "react";

interface CardProps {
  title: string | ReactNode;
  children;
  buttons?: ReactNode;
}

// TODO - This is unstyled. Currently used on Account page
export default function Card({ title, buttons, children }: CardProps) {
  return (
    <div>
      <div>
        <h1>{title}</h1>
        {buttons && <div>{buttons}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
