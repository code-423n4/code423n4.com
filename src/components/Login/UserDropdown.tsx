import clsx from "clsx";
import { Link } from "gatsby";
import React from "react";
import Avatar from "react-avatar";

import useUser from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

import * as styles from "../../styles/Main.module.scss";

export default function UserDropdown() {
  const { currentUser, logUserOut } = useUser();

  const avatar = () => (
    <div className={styles.UserDropDown__Avatar}>
      <Avatar
        src={currentUser.image}
        name={currentUser.username}
        size="30px"
        round="30px"
      />
      <span className={styles.UserDropDown__Caret} aria-hidden>
        ▾
      </span>
    </div>
  );

  return (
    <>
      <Dropdown
        triggerButton={avatar()}
        wrapperClass={styles.UserDropDown__UserDropdownWrapper}
        triggerButtonClass={styles.UserDropDown__UserDropdown}
        openOnHover={true}
        className={styles.UserDropDown__Desktop}
      >
        <div className={styles.UserDropDown__UserDropdownList}>
          <span className={styles.UserDropDown__UserInfo}>{currentUser.username}</span>
          <Link to="/account" className={styles.Dropdown__Button}>
            Manage Account
          </Link>
          <button onClick={logUserOut} className={styles.Dropdown__Button}>
            <img
              src="/images/sign-out.svg"
              alt="logout icon"
              className={styles.UserDropDown__Icon}
              style={{ transform: "rotateY(180deg)" }}
            />
            Logout
          </button>
        </div>
      </Dropdown>
      <div className={styles.UserDropDown__Mobile}>
        <span className={styles.UserDropDown__MobileMenuItem}>
          <span className={styles.UserDropDown__Icon}>
            <Avatar
              src={currentUser.image}
              name={currentUser.username}
              size="30px"
              round="30px"
            />
          </span>
          {currentUser.username}
        </span>
        <Link
          to="/account"
          className={clsx(styles.UserDropDown__Button, styles.UserDropDown__MobileMenuItem)}
        >
          Manage Account
        </Link>
        <button
          onClick={logUserOut}
          className={clsx(styles.UserDropDown__Button, styles.UserDropDown__MobileMenuItem)}
        >
          <img
            src="/images/sign-out.svg"
            alt="logout icon"
            className={styles.UserDropDown__Icon}
            style={{ transform: "rotateY(180deg)" }}
          />
          Logout
        </button>
      </div>
    </>
  );
}
