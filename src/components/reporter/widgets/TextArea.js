import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import clsx from "clsx";

import * as styles from "./Widgets.module.scss";

const TextArea = ({ name, required, fieldState, isInvalid, onChange }) => {
  function handleChange(e) {
    onChange(e);
  }

  const checkPageLocation = () => {
    if (typeof window !== `undefined`) {
      return window.location.href.includes("/help");
    }
  };

  return (
    <Tabs className="alternate-tab">
      <TabList>
        <Tab>Edit</Tab>
        <Tab>Preview</Tab>
      </TabList>
      <TabPanel>
        <div className={clsx(styles.TextAreaContainer)}>
          <textarea
            className={clsx(
              styles.Control,
              styles.Text,
              styles.Textarea,
              isInvalid && "input-error"
            )}
            name={name}
            onChange={handleChange}
            required={required}
            value={fieldState}
            maxLength={checkPageLocation() ? 2000 : 65536}
          />

          {fieldState.length > 1900 && checkPageLocation() ? (
            <span className={clsx(styles.TextAreaCounter)}>
              {2000 - fieldState.length} char. remaining
            </span>
          ) : fieldState.length > 64000 ? (
            <span className={clsx(styles.TextAreaCounter)}>
              {65536 - fieldState.length} char. remaining
            </span>
          ) : (
            ""
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <ReactMarkdown
          className={clsx(styles.Control, styles.Markdown)}
          remarkPlugins={[remarkGfm, remarkBreaks]}
        >
          {fieldState}
        </ReactMarkdown>
      </TabPanel>
    </Tabs>
  );
};

export default TextArea;
