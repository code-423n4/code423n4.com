import React, { useState, useEffect, useCallback } from "react";
import { graphql } from "gatsby";
import { getDates } from "../utils/time";
import useUser from "../hooks/UserContext";

import ContestList from "../components/ContestList";
import DefaultLayout from "../templates/DefaultLayout";
import HomepageHero from "../components/content/HomepageHero";
import Testimonials from "../components/Testimonials";
import TrustBar from "../components/TrustBar";
import SecondaryNav from "../components/SecondaryNav";
import SecondaryNavItem from "../components/SecondaryNavItem";
import HomepageTopNames from "../components/content/HomepageTopNames";
import SkeletonLoader from "../components/SkeletonLoader";
import BottomCTA from "../components/BottomCTA";
import Pizzazz from "../components/content/Pizzazz";

export default function SiteIndex({ data }) {
  const { currentUser } = useUser();

  // @todo: implement global state management instead of props drilling
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const [filteredContests, setFilteredContest] = useState(null);
  const [viewMode, setViewMode] = useState("project"); // warden | project
  const contests = data.contests.edges;
  useEffect(() => {
    if (window.location.href.includes("#wardens")) {
      setViewMode("warden");
    }
    if (window.location.href.includes("#projects")) {
      setViewMode("project");
    }
  }, []);

  const updateContestStatus = useCallback(() => {
    updateContestStatusChanges(contestStatusChanges + 1);
    setFilteredContest(sortContests(contests));
  }, [contests, contestStatusChanges]);

  const sortContests = (contestArray) => {
    let statusObject = {
      upcomingContests: [],
      activeContests: [],
      swiperContests: [],
    };

    contestArray.forEach((element) => {
      const statusBasedOnDates = getDates(
        element.node.start_time,
        element.node.end_time
      ).contestStatus;
      const endTime = new Date(element.node.end_time);
      if (statusBasedOnDates === "soon") {
        statusObject.upcomingContests.push(element.node);
      } else if (statusBasedOnDates === "active") {
        statusObject.activeContests.push(element.node);
      }
      // status based on dates is "ended", limit to contests that have ended in the last 3 weeks
      else if (
        statusBasedOnDates === "completed" &&
        endTime.getTime() > Date.now() - 1814400000
      ) {
        statusObject.swiperContests.push(element.node);
      }
    });

    for (const keys in statusObject) {
      statusObject[keys].sort(function (a, b) {
        let keyA = new Date(a.start_time);
        let keyB = new Date(b.start_time);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
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
      bodyClass="home"
      key={"home" + contestStatusChanges}
      pageDescription="Code4rena is a competitive audit platform that finds more high-severity vulnerabilities, more quickly than any other auditing method."
    >
      {/* Nav switcher */}
      <SecondaryNav>
        <SecondaryNavItem
          to="#projects"
          active={viewMode === "project"}
          onClick={() => setViewMode("project")}
        >
          For Projects
        </SecondaryNavItem>
        <SecondaryNavItem
          to="#wardens"
          active={viewMode === "warden"}
          onClick={() => setViewMode("warden")}
        >
          For Wardens
        </SecondaryNavItem>
      </SecondaryNav>

      {/* Hero */}
      <HomepageHero viewMode={viewMode} />

      {/* Pizzazz */}
      <Pizzazz />

      {/* Top names bar under hero */}
      {!viewMode || (viewMode === "project" && <TrustBar />)}
      {viewMode === "warden" && <HomepageTopNames />}

      {/* Contests */}
      <section className={"home__featured-contests"} data-nosnippet>
        {/* Skeleton loader animation */}
        {!filteredContests ? (
          <SkeletonLoader layout={"background--" + viewMode} limitedWidth />
        ) : null}
        {/* Blurple background area */}
        {filteredContests &&
        (filteredContests.activeContests.length > 0 ||
          filteredContests.upcomingContests.length > 0) ? (
          <div className={"background--" + viewMode}>
            <div className="limited-width home__featured-contests-blurple-area">
              {/* Active contests */}
              {filteredContests &&
              filteredContests.activeContests.length > 0 ? (
                <div className="featured-contests__active background--low-contrast">
                  <h1 className="type__headline__l">Active audits</h1>
                  <p className="type__subline__s spacing-bottom__l">
                    Currently finding the highest-severity vulnerabilities for:
                  </p>
                  <ContestList
                    updateContestStatus={updateContestStatus}
                    contests={filteredContests.activeContests}
                    user={currentUser}
                  />
                </div>
              ) : null}

              {/* Upcoming contests */}
              {filteredContests &&
              filteredContests.upcomingContests.length > 0 ? (
                <div className="featured-contests__upcoming background--low-contrast">
                  <h2 className="type__headline__xs spacing-top__xl spacing-bottom__l">
                    Upcoming audits
                  </h2>
                  <ContestList
                    updateContestStatus={updateContestStatus}
                    contests={filteredContests.upcomingContests}
                    user={currentUser}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          ""
        )}
        {/* Completed contests */}
        {filteredContests && filteredContests.swiperContests.length > 0 ? (
          <div className="featured-contests__completed">
            <div className="limited-width">
              <h2 className="type__headline__xs spacing-bottom__l">
                Recently completed audits
              </h2>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.swiperContests}
                user={currentUser}
                swiper={true}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="limited-width" data-nosnippet>
        <Testimonials viewMode={viewMode} />
      </section>

      <section>
        <BottomCTA viewMode={viewMode} />
      </section>
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
