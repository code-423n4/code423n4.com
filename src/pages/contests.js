import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";
import ContestList from "../components/ContestList";

export default function Contests({ data }) {
  const contests = data.contests.edges;
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
    contests: allContestsJson(sort: { fields: end_time, order: DESC }) {
      edges {
        node {
          id
          title
          details
          hide
          start_time
          end_time
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
