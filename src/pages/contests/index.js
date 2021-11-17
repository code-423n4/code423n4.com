import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../../layouts/DefaultLayout";
import ContestList from "../../components/ContestList";
import { contestsByState } from "../../utils/filter";

export default function Contests({ data }) {
  const contests = data.contests.edges;

  const filteredContests = contestsByState({ contests });

  return (
    <DefaultLayout
      pageTitle="Contests"
      bodyClass="contests-page"
      // preview=""
      pageDescription="Current, upcoming, and past audit contests"
    >
      <div className="wrapper-main">
        {filteredContests.active.length > 0 ? (
          <section>
            <h1>Active contests</h1>
            <ContestList contests={filteredContests.active} />
          </section>
        ) : null}
        {filteredContests.soon.length > 0 ? (
          <section>
            <h1>Upcoming contests</h1>
            <ContestList contests={filteredContests.soon} />
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
    contests: allContestsCsv(sort: { fields: end_time, order: ASC }) {
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
