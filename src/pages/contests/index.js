import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";

import ContestList from "../../components/ContestList";
import DefaultLayout from "../../templates/DefaultLayout";

export default function Contests({ data }) {
  const [filteredContests, setFilteredContest] = useState(null);
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const contests = data.contests.edges;

  const sortContests = (array, status) => {
    const final = {
      upcomingContests: [],
      activeContests: [],
      sponsorReview: [],
      judging: [],
      awarding: [],
      reporting: [],
      completed: [],
      other: [],
    };

    array
      .map((element) => {
        const statusObject = status
          .filter((el) => el.contestId === element.node.contestid)
          .flat();
        if (statusObject === []) {
          return null;
        }
        return {
          ...element.node,
          status: statusObject[0]?.status
        };
      })
      .forEach((element) => {
        switch (element.status) {
          case "Pre-Contest":
            final.upcomingContests.push(element);
            break;
          case "Preview week":
            final.upcomingContests.push(element);
            break;
          case "Active Contest":
            final.activeContests.push(element);
            break;
          case "Sponsor Review":
            final.sponsorReview.push(element);
            break;
          case "Needs Judging":
            final.judging.push(element);
            break;
          case "Judging Complete":
            final.judging.push(element);
            break;
          case "Awarding":
            final.awarding.push(element);
            break;
          case "Reporting":
            final.reporting.push(element);
            break;
          case "Completed":
            final.completed.push(element);
            break;
          default:
            final.other.push(element);
            break;
        }
      });
    return final;
  };

  useEffect(() => {
    fetch("/.netlify/functions/getNotionData")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setFilteredContest(sortContests(contests, data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [contests]);

  return (
    <DefaultLayout
      key={"contests" + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      pageDescription="Current, upcoming, and past audit contests"
    >
      <div className="wrapper-main">
        {filteredContests && filteredContests.upcomingContests.length > 0 ? (
          <section>
            <h1>
              Upcoming contests ({filteredContests.upcomingContests.length})
            </h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.upcomingContests} />
          </section>
        ) : null}
        {filteredContests && filteredContests.activeContests.length > 0 ? (
          <section>
            <h1>Active contests ({filteredContests.activeContests.length})</h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.activeContests} />
          </section>
        ) : null}
        {filteredContests && filteredContests.sponsorReview.length > 0 ? (
          <section>
            <h1>
              Sponsor review in progress (
              {filteredContests.sponsorReview.length})
            </h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.sponsorReview} />
          </section>
        ) : null}
        {filteredContests && filteredContests.judging.length > 0 ? (
          <section>
            <h1>Judging in progress ({filteredContests.judging.length})</h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.judging} />
          </section>
        ) : null}
        {filteredContests && filteredContests.awarding.length > 0 ? (
          <section>
            <h1>Awarding in progress ({filteredContests.awarding.length})</h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.awarding} />
          </section>
        ) : null}
        {filteredContests && filteredContests.reporting.length > 0 ? (
          <section>
            <h1>Reporting in progress ({filteredContests.reporting.length})</h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.reporting} />
          </section>
        ) : null}
        {filteredContests && filteredContests.completed.length > 0 ? (
          <section>
            <h1>Completed contests ({filteredContests.completed.length})</h1>
            <ContestList updateContestStatusChanges={updateContestStatusChanges} contests={filteredContests.completed} />
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
                resize(width: 160) {
                  src
                }
              }
            }
            link
          }
          fields {
            submissionPath
            contestPath
          }
          contestid
        }
      }
    }
  }
`;
