import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import clsx from "clsx";

interface TextAreaProps {
  name: string;
  required: boolean;
  fieldState: string;
  isInvalid: boolean;
  onChange: React.ChangeEventHandler;
  maxSize?: number;
}

const TextArea = ({
  name,
  required,
  fieldState,
  isInvalid,
  onChange,
  maxSize,
}: TextAreaProps) => {
  function handleChange(e) {
    onChange(e);
  }

  return (
    <Tabs>
      <TabList className="secondary-nav">
        <Tab className="secondary-nav__item">Edit</Tab>
        <Tab className="secondary-nav__item">Preview</Tab>
      </TabList>
      <TabPanel>
        <div className="widget__textarea-container">
          <textarea
            className={clsx(
              "Widget__Control",
              "Widget__Text",
              "Widget__Textarea",
              isInvalid && "input-error"
            )}
            name={name}
            aria-describedby={name + "--error"}
            onChange={handleChange}
            required={required}
            value={fieldState}
            maxLength={maxSize}
          />

          {maxSize && fieldState.length > maxSize - 100 ? (
            <span className="widget__textarea-counter">
              {maxSize - fieldState.length} char. remaining
            </span>
          ) : (
            ""
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <ReactMarkdown
          className="widget__control widget__markdown"
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
