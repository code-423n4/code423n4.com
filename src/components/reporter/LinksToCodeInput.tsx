import React, { ReactNode } from "react";

import { DynamicInputGroup } from "../DynamicInputGroup";
import * as styles from "./widgets/Widgets.module.scss";

interface LinksToCodeProps {
  onChange: (payload: string[]) => void;
  linksToCode: string[];
}

const LinksToCode = ({ onChange, linksToCode }: LinksToCodeProps) => {
  const validator = (line: string): (string | ReactNode)[] => {
    const errors: (string | ReactNode)[] = [];
    const linksToCodeRegex = new RegExp("#L[0-9]+(-L[0-9]+)?$");
    if (!linksToCodeRegex.test(line)) {
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
    <div className="links-to-code">
      <label htmlFor="links-to-code" className={styles.Label}>
        Links to affected code *
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
        fields={linksToCode}
        onChange={onChange}
        fieldName="code block"
        required={true}
        validator={validator}
      ></DynamicInputGroup>
    </div>
  );
};

export default LinksToCode;
