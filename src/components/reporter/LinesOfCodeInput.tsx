import React, { ReactNode } from "react";

import { DynamicInputGroup } from "../DynamicInputGroup";
import * as styles from "./widgets/Widgets.module.scss";

interface LinesOfCodeProps {
  onChange: (payload: string[]) => void;
  linesOfCode: string[];
}

const LinesOfCode = ({ onChange, linesOfCode }: LinesOfCodeProps) => {
  const validator = (line: string): (string | ReactNode)[] => {
    const errors: (string | ReactNode)[] = [];
    const locRegex = new RegExp("#L[0-9]+(-L[0-9]+)?$");
    if (!locRegex.test(line)) {
      errors.push(
        <span>
          Please include at least one line number at the end of your URL.{" "}
          <a
            href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet#linking-to-code"
            target="_blank"
            rel="noreferrer"
            aria-label="How do I link to line numbers on GitHub? Opens in new window"
          >
            How do I link to line numbers on GitHub?
          </a>
        </span>
      );
    }
    return errors;
  };

  return (
    <div className="lines-of-code">
      <label htmlFor="lines-of-code" className={styles.Label}>
        Links to affected code
      </label>
      <p className={styles.Help}>
        Provide GitHub links, including line numbers, to all instances of this
        bug throughout the repo. (
        <a
          href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-a-permanent-link-to-a-code-snippet#linking-to-code"
          target="_blank"
          rel="noreferrer"
          aria-label="How do I link to line number on GitHub? Opens in new window."
        >
          How do I link to line numbers on GitHub?
        </a>
        )
      </p>
      <DynamicInputGroup
        fields={linesOfCode}
        onChange={onChange}
        fieldName="code block"
        required={true}
        validator={validator}
      ></DynamicInputGroup>
    </div>
  );
};

export default LinesOfCode;
