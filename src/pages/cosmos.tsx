import React, { useCallback, useEffect, useState } from "react";
import { graphql } from "gatsby";
import useUser from "../hooks/UserContext";

import ContestList from "../components/ContestList";
import DefaultLayout from "../templates/DefaultLayout";
import Definitions from "../components/content/Definitions";
import { getDates } from "../utils/time";
import { Contest } from "../../types/contest";

interface ContestStatusMap {
  upcomingContests: Contest[];
  activeContests: Contest[];
  sponsorReview: Contest[];
  judging: Contest[];
  awarding: Contest[];
  reporting: Contest[];
  completed: Contest[];
  other: Contest[];
}

const defaultContests = {
  upcomingContests: [],
  activeContests: [],
  sponsorReview: [],
  judging: [],
  awarding: [],
  reporting: [],
  completed: [],
  other: [],
};

export default function Contests({ data }) {
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const [filteredContests, setFilteredContest] = useState<ContestStatusMap>(
    defaultContests
  );

  const { currentUser } = useUser();

  useEffect(() => {
    setFilteredContest(sortContests(data.contests.edges));
  }, [data]);

  const updateContestStatus = useCallback(() => {
    // force react to rehydrate
    updateContestStatusChanges(contestStatusChanges + 1);
    setFilteredContest(sortContests(data.contests.edges));
  }, [data, contestStatusChanges]);

  const sortContests = (contestArray) => {
    let statusObject: ContestStatusMap = {
      upcomingContests: [],
      activeContests: [],
      sponsorReview: [],
      judging: [],
      awarding: [],
      reporting: [],
      completed: [],
      other: [],
    };

    contestArray.forEach((element) => {
      const contest = element.node as Contest;
      const statusBasedOnDates = getDates(contest.start_time, contest.end_time)
        .contestStatus;
      if (statusBasedOnDates === "soon") {
        switch (contest.fields.status) {
          case "Pre-Contest":
          case "Preview week":
          default:
            statusObject.upcomingContests.push(contest);
            break;
        }
      } else if (statusBasedOnDates === "active") {
        switch (contest.fields.status) {
          case "Active":
          case "Active Contest":
          default:
            statusObject.activeContests.push(contest);
            break;
        }
      } else if (statusBasedOnDates === "completed") {
        switch (contest.fields.status) {
          case "Sponsor Review":
          case "Needs Judging":
          case "Judging Complete":
          case "Awarding":
          case "Pre-sort":
          case "Reporting":
          default:
            statusObject.completed.push(contest);
            break;
        }
      } else {
        statusObject.other.push(contest);
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

  return (
    <DefaultLayout pageTitle="Cosmos" bodyClass="cosmos">
      <div className="limited-width type__copy form">
        <section className="cosmos-wrapper">
          <h1>Audit contests for the Cosmos ecosystem</h1>
          <p>
            Code4rena contests incentivize finding as many rare and high risk
            vulnerabilities as possible in a short, focused window.
          </p>
        </section>
        {filteredContests && filteredContests.activeContests.length > 0 && (
          <section className="cosmos-wrapper">
            <h2 className="upcoming-header">Active contests</h2>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.activeContests}
              user={currentUser}
            />
          </section>
        )}
        {filteredContests && filteredContests.upcomingContests.length > 0 && (
          <section className="cosmos-wrapper">
            <h2 className="upcoming-header">Upcoming contests</h2>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.upcomingContests}
              user={currentUser}
            />
          </section>
        )}
        {filteredContests && filteredContests.completed.length > 0 && (
          <section className="cosmos-wrapper">
            <h2>Completed contests</h2>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.completed.reverse()}
              user={currentUser}
            />
          </section>
        )}
        <section className="cosmos-bkg">
          <div className="cosmos-wrapper">
            <h2>Want to sponsor an audit contest for your project?</h2>
            <p>
              We’re booking new Cosmos contests now.{" "}
              <a href="https://discord.gg/code4rena">Join our Discord</a> and
              say, “I want to be a sponsor.”
            </p>
            <a className="button cta-button" href="https://docs.code4rena.com">
              Read how C4 works »
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
      filter: { hide: { ne: true }, league: { eq: "cosmos" } }
      sort: { fields: start_time, order: DESC }
    ) {
      edges {
        node {
          contestid
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
            artPath
            status
            codeAccess
          }
        }
      }
    }
  }
`;
