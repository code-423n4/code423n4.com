import clsx from "clsx";
import React, { useState } from "react";

import * as styles from "./Dropdown.module.scss";

export default function Dropdown({
  wrapperClass,
  triggerButtonClass,
  openOnHover,
  triggerButton,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={openOnHover ? () => setIsOpen(true) : null}
      onMouseLeave={openOnHover ? () => setIsOpen(false) : null}
      className={clsx(styles.Wrapper, wrapperClass && wrapperClass)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        onTouchStart={() => setIsOpen(!isOpen)}
        className={clsx(triggerButtonClass && triggerButtonClass)}
      >
        {triggerButton}
      </button>
      <div
        className={clsx(isOpen && styles.Open, styles.DropdownListContainer)}
      >
        <div className={styles.DropdownList}>{children}</div>
      </div>
    </div>
  );
}
