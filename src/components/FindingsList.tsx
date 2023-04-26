import clsx from "clsx";
import { formatDistance } from "date-fns";
import { Link } from "gatsby";
import React, { PropsWithChildren } from "react";

// types
import { Finding } from "../../types/finding";
// helpers
import { transformColor } from "../utils/color";
// hooks
import useUser from "../hooks/UserContext";
// components
import Login from "./Login/Login";

interface FindingsListProps extends PropsWithChildren {
  submissionPath: string;
  findings: Finding[];
  isLoading: boolean;
}

const FindingsList = ({
  submissionPath,
  findings,
  isLoading,
  children,
}: FindingsListProps) => {
  const { currentUser } = useUser();

  return currentUser.isLoggedIn ? (
    <ul className={"findings-list__list"}>
      {children && (
        <li
          className={clsx("findings-list__list-item", "findings-list__heading")}
        >
          {children}
        </li>
      )}
      {isLoading ? (
        // @todo: style loading state
        <li className={"findings-list__list-item"}>Loading...</li>
      ) : findings.length === 0 ? (
        <li className={"findings-list__list-item"}>
          No findings submitted for this contest
        </li>
      ) : (
        findings.map((finding) => {
          const created = new Date(finding.createdAt);
          const now = new Date();
          return (
            <li
              key={finding.issueNumber}
              className={"findings-list__list-item"}
            >
              <svg
                className={clsx(
                  "findings-list__status",
                  "findings-list__status--" + finding.state
                )}
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path
                  fillRule="evenodd"
                  d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                ></path>
              </svg>
              <div>
                <div className={"findings-list__details"}>
                  <Link
                    to={`${submissionPath}?issue=${finding.issueNumber}`}
                    state={{ finding: finding }}
                    className={clsx(
                      "FindingsList__Title--" + finding.state,
                      "FindingsList__Title"
                    )}
                  >
                    {finding.title}
                  </Link>
                  {finding.labels.map((label) => (
                    <span
                      key={label.name}
                      className={"findings-list__risk"}
                      style={{ color: transformColor(label.color, 120) }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
                <div>
                  <span className={"findings-list__time"}>
                    {"Submitted "}
                    <time dateTime={finding.updatedAt}>
                      {formatDistance(created, now)}
                    </time>
                    {" ago"}
                  </span>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  ) : (
    <div>
      <h1>Please log in</h1>
      <p>You must be logged in to view your findings.</p>
      <Login displayAsButtons={true} />
    </div>
  );
};

export default FindingsList;
