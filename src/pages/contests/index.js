import React, { useState } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../../layouts/DefaultLayout";
import ContestList from "../../components/ContestList";
import { contestsByState } from "../../utils/filter";

export default function Contests({ data }) {
  // @todo: implement global state management instead of props drilling
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);

  const updateContestStatus = () => {
    updateContestStatusChanges(contestStatusChanges + 1);
  }

  const contests = data.contests.edges;

  const filteredContests = contestsByState({ contests });

  return (
    <DefaultLayout
      key={'contests' + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      // preview=""
      pageDescription="Current, upcoming, and past audit contests"
    >
      <div className="wrapper-main">
        {filteredContests.active.length > 0 ? (
          <section>
            <h1>Active contests</h1>
            <ContestList
              contests={filteredContests.active}
              updateContestStatus={updateContestStatus}
            />
          </section>
        ) : null}
        {filteredContests.soon.length > 0 ? (
          <section>
            <h1>Upcoming contests</h1>
            <ContestList
              contests={filteredContests.soon}
              updateContestStatus={updateContestStatus}
            />
          </section>
        ) : null}
        {filteredContests.completed.length > 0 ? (
          <section>
            <h1>Completed contests</h1>
            <ContestList contests={filteredContests.completed} />
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
        }
      }
    }
  }
`;
