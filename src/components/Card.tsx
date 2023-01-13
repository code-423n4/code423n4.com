import React, { ReactNode } from "react";

import * as styles from "../styles/Main.module.scss";

interface CardProps {
  title: string | ReactNode;
  children;
  buttons?: ReactNode;
}

export default function Card({ title, buttons, children }: CardProps) {
  return (
    <div className={styles.Card__Card}>
      <div className={styles.Card__TitleContainer}>
        <h1 className={styles.Card__Title}>{title}</h1>
        {buttons && <div className={styles.Card__ButtonsWrapper}>{buttons}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
