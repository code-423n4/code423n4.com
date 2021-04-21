import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";
import HeroIndex from "../components/content/HeroIndex";
import Definitions from "../components/content/Definitions";
import ContestList from "../components/ContestList";

export default function SiteIndex({ data }) {
  const contests = data.contests.edges;

  return (
    <DefaultLayout title="Code 423n4" bodyClass="landing">
      <HeroIndex />
      <div className="wrapper-main">
        <section>
          <Definitions />
          {contests ? <ContestList contests={contests} /> : ""}
        </section>
        <section className="center">
          <h5>Want to learn more?</h5>
          <div className="button-wrapper">
            <a
              className="button cta-button"
              href="https://medium.com/@scott_lew_is/introducing-code-432n4-f4a12d92a35d"
            >
              <strong>Read the intro post</strong>
            </a>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsJson(
      filter: { hide: { ne: true } }
      sort: { fields: end_time, order: DESC }
    ) {
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
