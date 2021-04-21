import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";
import ContestList from "../components/ContestList";
import { getTimeRemaining, getDates, getTimeState } from "../utils/time";

export default function Contests({ data }) {
  const contests = data.contests.edges;

  // TODO: group contests by date
  // TODO: set contest state based on grouping
  // TODO: add to template in subsets (active / soon / recently completed)

  return (
    <DefaultLayout title="Contests" bodyClass="">
      <div className="wrapper-main">
        <section>{contests ? <ContestList contests={contests} /> : ""}</section>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsJson(sort: { fields: end_time, order: ASC }) {
      edges {
        node {
          id
          title
          details
          hide
          start_time
          end_time
          amount
          repo
          sponsor {
            name
            image
            link
          }
          wardens {
            name
            image
            link
          }
          judges {
            name
            image
            link
          }
        }
      }
    }
  }
`;
