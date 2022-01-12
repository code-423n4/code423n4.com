import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import clsx from "clsx";
import * as styles from "./Widgets.module.scss";

const TextArea = (props) => {
  const { name, label, helptext, required, fieldState } = props;

  function handleChange(e) {
    props.onChange(e);
  }

  return (
    <div className={styles.Container}>
      <label className={styles.Label}>{label}</label>
      <p className={styles.Help}>{helptext}</p>
      <Tabs className="alternate-tab">
        <TabList>
          <Tab>Edit</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <TabPanel>
          <textarea
            className={clsx(styles.Control, styles.Text, styles.Textarea)}
            name={name}
            onChange={handleChange}
            required={required}
            value={fieldState}
          />
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
    </div>
  );
};

export default TextArea;
