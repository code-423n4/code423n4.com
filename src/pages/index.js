import React, { useState, useEffect, useCallback } from "react";
import { graphql } from "gatsby";
import { getDates } from "../utils/time";
import useUser from "../hooks/UserContext";

import ContestList from "../components/ContestList";
import DefaultLayout from "../templates/DefaultLayout";
import HomepageHero from "../components/content/HomepageHero";
import Testimonials from "../components/Testimonials";
import SecondaryNav from "../components/SecondaryNav";
import SecondaryNavItem from "../components/SecondaryNavItem";
import HomepageTopNames from "../components/content/HomepageTopNames";

export default function SiteIndex({ data }) {
  const { currentUser } = useUser();

  // @todo: implement global state management instead of props drilling
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const [filteredContests, setFilteredContest] = useState(null);
  const contests = data.contests.edges;

  const updateContestStatus = useCallback(() => {
    updateContestStatusChanges(contestStatusChanges + 1);
    setFilteredContest(sortContests(contests));
  }, [contests, contestStatusChanges]);

  const sortContests = (contestArray) => {
    let statusObject = {
      upcomingContests: [],
      activeContests: [],
    };

    contestArray.forEach((element) => {
      const statusBasedOnDates = getDates(
        element.node.start_time,
        element.node.end_time
      ).contestStatus;
      if (statusBasedOnDates === "soon") {
        statusObject.upcomingContests.push(element.node);
      } else if (statusBasedOnDates === "active") {
        statusObject.activeContests.push(element.node);
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
    <DefaultLayout bodyClass="home" key={"home" + contestStatusChanges}>
      <SecondaryNav>
        <SecondaryNavItem to="#wardens" active>
          For Wardens
        </SecondaryNavItem>
        <SecondaryNavItem to="#sponsors">For Sponsors</SecondaryNavItem>
      </SecondaryNav>

      <HomepageHero />

      <HomepageTopNames />

      {filteredContests && filteredContests.activeContests.length > 0 ? (
        <section className="home__featured-contests background--blurple">
          <div className="limited-width">
            <h1 className="type__headline__m">Active competitive audits</h1>
            <p className="type__subline__m">
              Currently finding the highest-severity vulnerabilities for:
            </p>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.activeContests}
              user={currentUser}
            />
          </div>
        </section>
      ) : null}
      {/* {filteredContests && filteredContests.upcomingContests.length > 0 ? (
          <section>
            <h1 className="upcoming-header">Upcoming contests</h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.upcomingContests}
              user={currentUser}
            />
          </section>
        ) : null} */}

      {/* <section>
          <Testimonials />
        </section>
        <section className="center">
          <h5>Want to learn more?</h5>
          <div className="button-wrapper">
            <a className="button cta-button" href="https://docs.code4rena.com">
              <strong>Read the docs</strong>
            </a>
          </div>
        </section> */}
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
