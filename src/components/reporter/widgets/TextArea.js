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
            maxLength={65536}
          />
          <span className={clsx(styles.TextAreaCounter)}>{fieldState.length}/65,536</span>
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
