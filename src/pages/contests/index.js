import React, { useCallback, useEffect, useState } from "react";
import { graphql } from "gatsby";
import { getDates } from "../../utils/time";
import useUser from "../../hooks/UserContext";

import ContestList from "../../components/ContestList";
import DefaultLayout from "../../templates/DefaultLayout";

export default function Contests({ data }) {
  const { currentUser } = useUser();
  const [filteredContests, setFilteredContest] = useState(null);
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const contests = data.contests.edges;

  const updateContestStatus = useCallback(() => {
    // force react to rehydrate
    updateContestStatusChanges(contestStatusChanges + 1);
    setFilteredContest(sortContests(contests));
  }, [contests, contestStatusChanges]);

  const sortContests = (contestArray) => {
    let statusObject = {
      upcomingContests: [],
      activeContests: [],
      sponsorReview: [],
      judging: [],
      awarding: [],
      reporting: [],
      completed: [],
      other: [],
    };

    contestArray.forEach((element) => {
      const statusBasedOnDates = getDates(
        element.node.start_time,
        element.node.end_time
      ).contestStatus;
      if (statusBasedOnDates === "soon") {
        switch (element.node.fields.status) {
          case "Pre-Contest":
          case "Preview week":
          default:
            statusObject.upcomingContests.push(element.node);
            break;
        }
      } else if (statusBasedOnDates === "active") {
        switch (element.node.fields.status) {
          case "Active":
          case "Active Contest":
          default:
            statusObject.activeContests.push(element.node);
            break;
        }
      } else if (statusBasedOnDates === "completed") {
        switch (element.node.fields.status) {
          case "Sponsor Review":
          case "Needs Judging":
          case "Judging Complete":
          case "Awarding":
          case "Pre-sort":
          case "Reporting":
          default:
            statusObject.completed.push(element.node);
            break;
        }
      } else {
        statusObject.other.push(element.node);
      }
    });
    for (const keys in statusObject) {
      statusObject[keys].sort(function (a, b) {
        let keyA = new Date(a.start_time);
        let keyB = new Date(b.start_time);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    }
    return statusObject;
  };

  useEffect(() => {
    if (contests) {
      setFilteredContest(sortContests(contests));
    }
  }, [contests]);

  return (
    <DefaultLayout
      key={"contests" + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      pageDescription="Current, upcoming, and past audit contests"
    >
      <div className="limited-width">
        {filteredContests && filteredContests.activeContests.length > 0 ? (
          <section>
            <h1 className="type__headline__page-title">Active audits</h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.activeContests}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.upcomingContests.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Upcoming audits
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.upcomingContests}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.sponsorReview.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Sponsor review in progress
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.sponsorReview}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.judging.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Judging in progress
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.judging}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.awarding.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Awarding in progress
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.awarding}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.reporting.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Reporting in progress
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.reporting}
              user={currentUser}
            />
          </section>
        ) : null}
        {filteredContests && filteredContests.completed.length > 0 ? (
          <section>
            <h1 className="spacing-bottom__xl type__headline_l">
              Completed audits
            </h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.completed.reverse()}
              user={currentUser}
            />
          </section>
        ) : null}
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsCsv(
      filter: { hide: { ne: true } }
      sort: { fields: end_time, order: ASC }
    ) {
      edges {
        node {
          id
          title
          details
          hide
          league
          start_time
          end_time
          amount
          repo
          findingsRepo
          sponsor {
            name
            image {
              childImageSharp {
                resize(width: 80) {
                  src
                }
              }
            }
            link
          }
          fields {
            submissionPath
            contestPath
            status
            codeAccess
          }
          contestid
        }
      }
    }
  }
`;
