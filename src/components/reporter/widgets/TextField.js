import React from "react";
import clsx from "clsx";

import * as styles from "../../../styles/Main.module.scss";

const TextField = ({ name, required, fieldState, isInvalid, onChange }) => {
  function handleChange(e) {
    onChange(e);
  }

  return (
    <input
      className={clsx(styles.Widget__Control, styles.Widget__Text, isInvalid && "input-error")}
      name={name}
      type="text"
      onChange={handleChange}
      required={required}
      value={fieldState}
    />
  );
};

export default TextField;
