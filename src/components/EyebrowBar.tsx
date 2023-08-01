import React from "react";
import { Link } from "gatsby";

export default function EyebrowBar() {
  return (
    <div className="eyebrow-bar">
      <p className="eyebrow-bar__content limited-width">
        Introducing Test Coverage: the solution for accelerating speed to launch
        without compromise.
        <Link to="/test-coverage" className="eyebrow-bar__button">
          Learn more →
        </Link>
      </p>
    </div>
  );
}
