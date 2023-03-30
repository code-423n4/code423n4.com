import React from "react";
import { Link } from "gatsby";

export default function EyebrowBar() {
  return (
    <div className="eyebrow-bar">
      <p className="eyebrow-bar__content limited-width">
        Bots bots bots bots bots bots bots bots bots bots bots bots{" "}
        <Link to="/register/bot" className="eyebrow-bar__button">
          bots bots →
        </Link>
      </p>
    </div>
  );
}
