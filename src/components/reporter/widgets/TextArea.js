import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import clsx from "clsx";
import * as styles from "../../../styles/Main.module.scss";

const TextArea = ({
  name,
  required,
  fieldState,
  isInvalid,
  onChange,
  maxSize,
}) => {
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
        <div className={clsx(styles.Widget__TextAreaContainer)}>
          <textarea
            className={clsx(
              styles.Widget__Control,
              styles.Widget__Text,
              styles.Widget__Textarea,
              isInvalid && "input-error"
            )}
            name={name}
            onChange={handleChange}
            required={required}
            value={fieldState}
            maxLength={maxSize}
          />

          {maxSize && fieldState.length > maxSize - 100 ? (
            <span className={clsx(styles.Widget__TextAreaCounter)}>
              {maxSize - fieldState.length} char. remaining
            </span>
          ) : (
            ""
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <ReactMarkdown
          className={clsx(styles.Widget__Control, styles.Widget__Markdown)}
          remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {fieldState}
        </ReactMarkdown>
      </TabPanel>
    </Tabs>
  );
};

export default TextArea;
