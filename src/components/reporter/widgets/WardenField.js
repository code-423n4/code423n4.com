import React, { useCallback } from "react";
import { Link } from "gatsby";
import Select from "react-select";
import * as baseStyles from "./Widgets.module.scss";
import * as styles from "./WardenField.module.scss";

const WardenOptionLabel = ({ value, image }) => {
  return (
    <div className={styles.OptionContainer}>
      <img
        src={
          image
            ? image.childImageSharp.resize.src
            : "https://placekitten.com/g/64/64"
        }
      />
      <span>{value}</span>
    </div>
  );
};

const WardenField = ({ label, helptext, options, onChange, fieldState }) => {
  const handleChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : '';
      onChange({ target: { name: "handle", value } });
    },
    [onChange]
  );

  return (
    <div className={baseStyles.Container}>
      <label className={baseStyles.Label}>{label}</label>
      <p className={baseStyles.Help}>{helptext}</p>
      <Select
        value={options.find((o) => o.value === fieldState) || undefined}
        formatOptionLabel={WardenOptionLabel}
        options={options}
        onChange={handleChange}
        className={styles.ReactSelect}
        classNamePrefix="react-select"
        isClearable={true}
      />
      <p className={baseStyles.Help}>
        <small>
          Don't see your handle?{" "}
          <Link to="/warden-registration">Click here</Link> to register.
        </small>
      </p>
    </div>
  );
};

export default WardenField;
