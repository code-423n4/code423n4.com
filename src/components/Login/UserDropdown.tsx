import clsx from "clsx";
import { Link } from "gatsby";
import React from "react";
import Avatar from "react-avatar";

import useUser from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

export default function UserDropdown() {
  const { currentUser, logUserOut } = useUser();

  const avatar = () => (
    <div className={"user-dropdown__avatar"}>
      <Avatar
        src={currentUser.image}
        name={currentUser.username}
        size="30px"
        round="30px"
      />
      <span className={"user-dropdown__caret"} aria-hidden>
        ▾
      </span>
    </div>
  );

  return (
    <>
      <Dropdown
        triggerButton={avatar()}
        wrapperClass={"user-dropdown__user-dropdown-wrapper"}
        triggerButtonClass={"user-dropdown__user-dropdown"}
        openOnHover={true}
        className={"user-dropdown__desktop"}
      >
        <div className={"user-dropdown__user-dropdown-list"}>
          <span className={"user-dropdown__user-info"}>
            {currentUser.username}
          </span>
          <Link to="/account" className={"dropdown__button"}>
            Manage Account
          </Link>
          <button onClick={logUserOut} className={"dropdown__button"}>
            <img
              src="/images/sign-out.svg"
              alt="logout icon"
              className={"user-dropdown__icon"}
              style={{ transform: "rotateY(180deg)" }}
            />
            Logout
          </button>
        </div>
      </Dropdown>
      <div className={"user-dropdown__mobile"}>
        <span className={"user-dropdown__mobile-menu-item"}>
          <span className={"user-dropdown__icon"}>
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
          className={clsx(
            "user-dropdown__button",
            "user-dropdown__mobile-menu-item"
          )}
        >
          Manage Account
        </Link>
        <button
          onClick={logUserOut}
          className={clsx(
            "user-dropdown__button",
            "user-dropdown__mobile-menu-item"
          )}
        >
          <img
            src="/images/sign-out.svg"
            alt="logout icon"
            className={"user-dropdown__icon"}
            style={{ transform: "rotateY(180deg)" }}
          />
          Logout
        </button>
      </div>
    </>
  );
}
