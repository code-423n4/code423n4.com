import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../../layouts/DefaultLayout";
import ContestList from "../../components/ContestList";
import { getTimeRemaining, getDates } from "../../utils/time";
import { sortByContestStart } from "../../utils/sort";

export default function Contests({ data }) {
  const contests = data.contests.edges;

  const contestsByLeague = {
    active: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).state === "active"
    ),
    soon: contests.filter(
      (c) => getDates(c.node.start_time, c.node.end_time).state === "soon"
    ),
    completed: contests
      .filter(
        (c) =>
          getDates(c.node.start_time, c.node.end_time).state === "completed"
      )
      .sort(sortByContestStart("reverse")),
  };

  return (
    <DefaultLayout pageTitle="Contests" bodyClass="contests-page">
      <div className="wrapper-main">
        {contestsByLeague.active ? (
          <section>
            <h2>Active contests</h2>
            <ContestList contests={contestsByLeague.active} />
          </section>
        ) : (
          ""
        )}
        {contestsByLeague.soon ? (
          <section>
            <h2>Upcoming contests</h2>
            <ContestList contests={contestsByLeague.soon} />
          </section>
        ) : (
          ""
        )}
        {contestsByLeague.completed ? (
          <section>
            <h2>Completed contests</h2>
            <ContestList contests={contestsByLeague.completed} />
          </section>
        ) : (
          ""
        )}
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
          }
        }
      }
    }
  }
`;
