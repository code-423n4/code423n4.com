import React, { useCallback } from "react";
import clsx from "clsx";
import { Link } from "gatsby";

import Select from "react-select";

import * as styles from "./WardenField.module.scss";
import * as baseStyles from "./Widgets.module.scss";

const WardenOptionLabel = ({ value, image }) => {
  return (
    <div className={styles.OptionContainer}>
      <img
        src={
          image
            ? image.childImageSharp.resize.src
            : "https://placekitten.com/g/64/64"
        }
        alt={"avatar for " + value}
      />
      <span>{value}</span>
    </div>
  );
};

const WardenField = ({ name, required, options, onChange, fieldState, isInvalid }) => {
  const handleChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : "";
      onChange({ target: { name, value } });
    },
    [onChange, name]
  );

  return (
    <>
      <Select
        name={name}
        required={required}
        value={options.find((o) => o.value === fieldState) || undefined}
        formatOptionLabel={WardenOptionLabel}
        options={options}
        onChange={handleChange}
        className={clsx(styles.ReactSelect, isInvalid && styles.Invalid)}
        classNamePrefix="react-select"
        isClearable={true}
      />
      <p className={baseStyles.Help}>
        <small>
          Don't see your handle?{" "}
          <Link to="/warden-registration">Click here</Link> to register.
        </small>
      </p>
    </>
  );
};

export default WardenField;
