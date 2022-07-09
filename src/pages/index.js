import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import ContestList from "../components/ContestList";
import DefaultLayout from "../templates/DefaultLayout";
import HeroIndex from "../components/content/HeroIndex";
import Testimonials from "../components/Testimonials";

export default function SiteIndex({ data }) {
  // @todo: implement global state management instead of props drilling
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const [filteredContests, setFilteredContest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const contests = data.contests.edges;

  const updateContestStatus = () => {
    updateContestStatusChanges(contestStatusChanges + 1);
  };

  const sortContests = (array, status) => {
    let statusObject = {
      upcomingContests: [],
      activeContests: [],
    };

    array.forEach((element) => {
      const statusAndIdObj = status.filter(
        (el) => el.contestId === element.node.contestid
      );
      if (statusAndIdObj === []) {
        return null;
      }
      const data = {
        ...element.node,
        status: statusAndIdObj[0]?.status,
      };
      switch (statusAndIdObj[0]?.status) {
        case "Pre-Contest":
        case "Preview week":
          statusObject.upcomingContests.push(data);
          break;
        case "Active":
        case "Active Contest":
          statusObject.activeContests.push(data);
          break;
        default:
          break;
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
    setIsLoading(true);
    fetch("/.netlify/functions/get-contests")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setFilteredContest(sortContests(contests, data));
      })
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [contests]);

  return (
    <DefaultLayout bodyClass="landing" key={"landing" + contestStatusChanges}>
      <div className="hero-wrapper">
        <HeroIndex />
      </div>
      <div className="wrapper-main">
        {isLoading ? (
          <div className="wrapper-main">
            <h2 className="center">Loading contests...</h2>
          </div>
        ) : (
          <section>
            {filteredContests && filteredContests.activeContests.length > 0 ? (
              <section>
                <h1 className="upcoming-header">
                  Active contests ({filteredContests.activeContests.length})
                </h1>
                <ContestList
                  updateContestStatus={updateContestStatus}
                  contests={filteredContests.activeContests}
                />
              </section>
            ) : null}
            {filteredContests &&
            filteredContests.upcomingContests.length > 0 ? (
              <section>
                <h1 className="upcoming-header">
                  Upcoming contests ({filteredContests.upcomingContests.length})
                </h1>
                <ContestList
                  updateContestStatus={updateContestStatus}
                  contests={filteredContests.upcomingContests}
                />
              </section>
            ) : null}
          </section>
        )}
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
          contestid
        }
      }
    }
  }
`;
