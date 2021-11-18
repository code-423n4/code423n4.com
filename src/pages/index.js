import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";
import HeroIndex from "../components/content/HeroIndex";
import Definitions from "../components/content/Definitions";
import ContestList from "../components/ContestList";
import Testimonials from "../components/Testimonials";
import { contestsByState } from "../utils/filter";

export default function SiteIndex({ data }) {
  const contests = data.contests.edges;
  const filteredContests = contestsByState({ contests }, true);

  return (
    <DefaultLayout bodyClass="landing">
      <div className="hero-wrapper">
        <HeroIndex />
      </div>
      <div className="wrapper-main">
        <section>
          {filteredContests.active.length > 0 ? (
            <ContestList contests={filteredContests.active} />
          ) : null}
          <h1 className="upcoming-header">Upcoming Contests</h1>
          {filteredContests.soon.length > 0 ? (
            <ContestList contests={filteredContests.soon} />
          ) : null}
        </section>
        <section>
          <Testimonials />
        </section>
        <section className="center">
          <h5>Want to learn more?</h5>
          <div className="button-wrapper">
            <a className="button cta-button" href="https://docs.code4rena.com">
              <strong>Read the docs</strong>
            </a>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsCsv(
      filter: { hide: { ne: true } }
      sort: { fields: start_time, order: ASC }
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
