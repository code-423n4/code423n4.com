import clsx from "clsx";
import { formatDistance, differenceInSeconds } from "date-fns";
import { Link } from "gatsby";
import React from "react";

import useUser from "../hooks/UserContext";

import Login from "./Login/Login";

import * as styles from "./FindingsList.module.scss";
import * as formStyles from "./form/Form.module.scss";

interface Finding {
  id: string;
  title: string;
  body: string;
  labels: { name: string; color: string }[];
  number: number;
  state: string;
  createdAt: string;
  updatedAt: string;
}

interface FindingsListProps {
  submissionPath: string;
  findings: Finding[];
}

const FindingsList = ({ submissionPath, findings }: FindingsListProps) => {
  const { currentUser } = useUser();

  return currentUser.isLoggedIn ? (
    <>
      {findings.length > 0 ? (
        <ul className={styles.List}>
          {findings.map((finding) => {
            const updated = new Date(finding.updatedAt);
            const created = new Date(finding.createdAt);
            const now = new Date();
            return (
              <li key={finding.id} className={styles.ListItem}>
                <svg
                  className={clsx(styles[finding.state], styles.Status)}
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                  ></path>
                </svg>
                <div>
                  <div className={styles.Details}>
                    <Link
                      to={`${submissionPath}?issue=${finding.number}`}
                      state={{ finding: finding }}
                      className={clsx(styles[finding.state], styles.Title)}
                    >
                      {finding.title}
                    </Link>
                    {finding.labels.map((label) => (
                      <span
                        key={label.name}
                        className={styles.Risk}
                        style={{ color: `#${label.color}` }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className={styles.Time}>
                      {"Submitted "}
                      <time dateTime={finding.updatedAt}>
                        {formatDistance(created, now)}
                      </time>
                      {" ago"}
                    </span>
                    {/* 
                      if updated is within a few seconds of created, it's most likely just the
                      comment that gets added when the data file is created, so we don't want
                      to display that as an update.
                    */}
                    {differenceInSeconds(updated, created) > 3 && (
                      <span className={styles.Time}>
                        {", Updated "}
                        <time dateTime={finding.updatedAt}>
                          {formatDistance(updated, now)}
                        </time>
                        {" ago"}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        // @todo: style loading state
        <p>Loading...</p>
      )}
    </>
  ) : (
    <div className="centered-text">
      <div className={formStyles.Form}>
        <h1>Please login</h1>
        <p>You must be logged in to view your findings.</p>
        <Login displayAsButtons={true} />
      </div>
    </div>
  );
};

export default FindingsList;
