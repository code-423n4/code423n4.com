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
      <span className={"user-dropdown__caret"} aria-hidden></span>
    </div>
  );

  return (
    <>
      <Dropdown
        triggerButton={avatar()}
        wrapperClass={"user-dropdown "}
        triggerButtonClass={"user-dropdown__trigger"}
        openOnHover={true}
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
    </>
  );
}
