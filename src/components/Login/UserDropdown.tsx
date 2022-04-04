import React from "react";
import Avatar from "react-avatar";

import useUser from "../../hooks/UserContext";
import Dropdown from "../Dropdown";

import * as styles from "./UserDropdown.module.scss";

export default function UserDropdown() {
  const { currentUser, logUserOut } = useUser();

  const avatar = () => (
    <Avatar
      src={currentUser.img}
      name={currentUser.username}
      size="30px"
      round="30px"
    />
  );

  return (
    <Dropdown
      triggerButton={avatar()}
      wrapperClass={styles.UserDropdownWrapper}
      triggerButtonClass={styles.UserDropdown}
      openOnHover={false}
    >
      <div className={styles.UserDropdownList}>
        <span>{currentUser.address}</span>
        <button onClick={logUserOut} className={styles.Button}>
          logout
        </button>
      </div>
    </Dropdown>
  );
}
