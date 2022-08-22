import clsx from "clsx";
import React, { useState } from "react";

import * as styles from "./Dropdown.module.scss";

export default function Dropdown({
  wrapperClass,
  triggerButtonClass,
  openOnHover,
  triggerButton,
  children,
  className = null,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={openOnHover ? () => setIsOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setIsOpen(false) : undefined}
      className={clsx(className, styles.Wrapper, wrapperClass && wrapperClass)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        onTouchStart={() => setIsOpen(!isOpen)}
        className={clsx(triggerButtonClass && triggerButtonClass)}
      >
        {triggerButton}
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          className={clsx(styles.DropdownIcon, isOpen && styles.Open)}
        >
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      </button>
      <div
        className={clsx(isOpen && styles.Open, styles.DropdownListContainer)}
      >
        <div className={styles.DropdownList}>{children}</div>
      </div>
    </div>
  );
}
