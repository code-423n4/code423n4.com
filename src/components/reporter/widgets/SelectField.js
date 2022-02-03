import React, { useState } from "react";
import clsx from "clsx";
import * as styles from "./Widgets.module.scss";

const SelectField = ({ name, options, onChange, isInvalid, contest }) => {
  const [value, setValue] = useState("");
  const [qaMessage, setQaMessage] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
    const { name, value } = e.target;

    if (
      (name === "risk" && value.slice(0, 1) <= 1) ||
      (name === "risk" && value.slice(0, 1)) === "G"
    ) {
      setQaMessage(true);
    } else {
      setQaMessage(false);
    }
  };

  return (
    <>
      {qaMessage && (
        <div>
          <p className="warning-message">
            👋 Hi there! We've changed the way we are handling low risk,
            non-critical, and gas optimization findings. Please submit all low
            risk and non critical findings as one report, and gas optimization
            findings as another, separate report. Submissions for medium and
            high risk findings are not changing. Check out{" "}
            <a href="https://docs.code4rena.com/roles/wardens/judging-criteria">the docs</a> and <a href="https://docs.code4rena.com/roles/wardens/qa-gas-report-faq">FAQ about QA and Gas Reports</a> for more details.
          </p>
        </div>
      )}
      <select
        className={clsx(
          styles.Control,
          styles.Select,
          isInvalid && "input-error",
          value === "" && styles.Placeholder
        )}
        name={name}
        onChange={handleChange}
      >
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={"option-" + index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectField;
