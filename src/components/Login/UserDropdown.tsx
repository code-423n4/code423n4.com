import clsx from "clsx";
import { Link } from "gatsby";
import React from "react";
import Avatar from "react-avatar";

import useUser from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

import * as styles from "./UserDropdown.module.scss";
import * as dropdownStyles from "../Dropdown.module.scss";

export default function UserDropdown() {
  const { currentUser, logUserOut } = useUser();

  const avatar = () => (
    <div className={styles.Avatar}>
      <Avatar
        src={currentUser.image}
        name={currentUser.username}
        size="30px"
        round="30px"
      />
      <span className={styles.Caret} aria-hidden>
        ▾
      </span>
    </div>
  );

  return (
    <>
      <Dropdown
        triggerButton={avatar()}
        wrapperClass={styles.UserDropdownWrapper}
        triggerButtonClass={styles.UserDropdown}
        openOnHover={true}
        className={styles.Desktop}
      >
        <div className={styles.UserDropdownList}>
          <span className={styles.UserInfo}>
            Address:{" "}
            {currentUser.address.slice(0, 5) +
              "..." +
              currentUser.address.slice(-4)}
          </span>
          <Link to="/my/findings" className={dropdownStyles.Button}>
            Manage Findings
          </Link>
          <Link to="/account" className={dropdownStyles.Button}>
            Manage Account
          </Link>
          <button onClick={logUserOut} className={dropdownStyles.Button}>
            <img
              src="/images/sign-out.svg"
              alt="logout icon"
              className={styles.Icon}
              style={{ transform: "rotateY(180deg)" }}
            />
            Logout
          </button>
        </div>
      </Dropdown>
      <div className={styles.Mobile}>
        <span className={styles.MobileMenuItem}>
          <span className={styles.Icon}>
            <Avatar
              src={currentUser.image}
              name={currentUser.username}
              size="30px"
              round="30px"
            />
          </span>
          {currentUser.address.slice(0, 5) +
            "..." +
            currentUser.address.slice(-4)}
        </span>
        <button
          onClick={logUserOut}
          className={clsx(styles.Button, styles.MobileMenuItem)}
        >
          <img
            src="/images/sign-out.svg"
            alt="logout icon"
            className={styles.Icon}
            style={{ transform: "rotateY(180deg)" }}
          />
          Logout
        </button>
      </div>
    </>
  );
}
