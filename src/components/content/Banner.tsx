import React from "react";
import useUser from "../../hooks/UserContext";
import { differenceInDays } from "date-fns";
import { Link } from "gatsby";

export default function Banner() {
  const { currentUser } = useUser();

  // @todo: update deadline
  const deadline = new Date("2022/5/15");

  return !currentUser.isLoggedIn ? (
    <div className="message-bar">
      <p>
        Heads up: in {differenceInDays(deadline, Date.now())} days, you will
        have to be registered with your wallet in order to submit findings.
        <Link to="/register">Register</Link>
      </p>
    </div>
  ) : null;
}
