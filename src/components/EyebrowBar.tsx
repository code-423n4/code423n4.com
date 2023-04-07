import React from "react";
import { Link } from "gatsby";

export default function EyebrowBar() {
  return (
    <div className="eyebrow-bar">
      <p className="eyebrow-bar__content limited-width">
        Introducing Bot Races: making AI the first phase of C4 competitive
        audits.
        <Link to="/register/bot" className="eyebrow-bar__button">
          Learn more →
        </Link>
      </p>
    </div>
  );
}
