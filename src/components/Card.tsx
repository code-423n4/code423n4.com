import React, { ReactNode } from "react";

import * as styles from "./Card.module.scss";

interface CardProps {
  title: string | ReactNode;
  children;
  buttons?: ReactNode;
}

export default function Card({ title, buttons, children }: CardProps) {
  return (
    <div className={styles.Card}>
      <div className={styles.TitleContainer}>
        <h1 className={styles.Title}>{title}</h1>
        {buttons && <div className={styles.ButtonsWrapper}>{buttons}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
