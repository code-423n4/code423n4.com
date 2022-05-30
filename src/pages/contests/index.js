import React, { useCallback, useEffect, useState } from "react";
import { graphql } from "gatsby";

import ContestList from "../../components/ContestList";
import DefaultLayout from "../../templates/DefaultLayout";

export default function Contests({ data }) {
  const [filteredContests, setFilteredContest] = useState([]);
  const contests = data.contests.edges;

  const sortContests = (array, status) => {
    const final = {
      upcomingContests: [],
      activeContests: [],
      sponsorReview: [],
      judging: [],
      awarding: [],
      reporting: [],
      completed: [],
      other: [],
    };

    array
      .map((element) => {
        const statusObject = status
          .filter((el) => el.contestId === element.node.contestid)
          .flat();
        if (statusObject === []) {
          return;
        }
        return { ...element.node, status: statusObject[0]?.status };
      })
      .forEach((element) => {
        switch (element.status) {
          case "Pre-Contest":
            final.upcomingContests.push(element);
            break;
          case "Preview week":
            final.upcomingContests.push(element);
            break;
          case "Active Contest":
            final.activeContests.push(element);
            break;
          case "Sponsor Review":
            final.sponsorReview.push(element);
            break;
          case "Needs Judging":
            final.judging.push(element);
            break;
          case "Judging Complete":
            final.judging.push(element);
            break;
          case "Awarding":
            final.awarding.push(element);
            break;
          case "Reporting":
            final.reporting.push(element);
            break;
          case "Completed":
            final.completed.push(element);
            break;
          default:
            final.other.push(element);
            break;
        }
      });
    return final;
  };

  useEffect(() => {
    fetch("http://localhost:8888/.netlify/functions/getNotionData")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setFilteredContest(sortContests(contests, data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <DefaultLayout
      // key={"contests" + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      // preview=""
      pageDescription="Current, upcoming, and past audit contests"
    >
      {/* <div className="wrapper-main">
        {filteredContests.active.length > 0 ? (
          <section>
            <h1>Active contests</h1>
            <ContestList
              contests={filteredContests.active}
              updateContestStatus={updateContestStatus}
            />
          </section>
        ) : null}
        {filteredContests.soon.length > 0 ? (
          <section>
            <h1>Upcoming contests</h1>
            <ContestList
              contests={filteredContests.soon}
              updateContestStatus={updateContestStatus}
            />
          </section>
        ) : null}
        {filteredContests.completed.length > 0 ? (
          <section>
            <h1>Completed contests</h1>
            <ContestList contests={filteredContests.completed} />
          </section>
        ) : null}
      </div> */}
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsCsv(
      filter: { hide: { ne: true } }
      sort: { fields: end_time, order: ASC }
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
