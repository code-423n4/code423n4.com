import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";

import ContestList from "../../components/ContestList";
import DefaultLayout from "../../templates/DefaultLayout";

export default function Contests({ data }) {
  const [filteredContests, setFilteredContest] = useState(null);
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const contests = data.contests.edges;
  const updateContestStatus = () => {
    updateContestStatusChanges(contestStatusChanges + 1);
  };

  const sortContests = (array, status) => {
    let statusObject = {
      upcomingContests: [],
      activeContests: [],
      sponsorReview: [],
      judging: [],
      awarding: [],
      reporting: [],
      completed: [],
      other: [],
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
        status: statusObject[0]?.status,
      };
      switch (statusAndIdObj[0]?.status) {
        case "Pre-Contest":
          statusObject.upcomingContests.push(data);
          break;
        case "Preview week":
          statusObject.upcomingContests.push(data);
          break;
        case "Active Contest":
          statusObject.activeContests.push(data);
          break;
        case "Active":
          statusObject.activeContests.push(data);
          break;
        case "Sponsor Review":
          statusObject.sponsorReview.push(data);
          break;
        case "Needs Judging":
          statusObject.judging.push(data);
          break;
        case "Judging Complete":
          statusObject.judging.push(data);
          break;
        case "Awarding":
          statusObject.awarding.push(data);
          break;
        case "Reporting":
          statusObject.reporting.push(data);
          break;
        case "Completed":
          statusObject.completed.push(data);
          break;
        default:
          statusObject.other.push(data);
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
    fetch("/.netlify/functions/getNotionData")
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
    <DefaultLayout
      key={"contests" + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      pageDescription="Current, upcoming, and past audit contests"
    >
      {isLoading ? (
        <div className="wrapper-main" style={{ height: "65vh" }}>
          <h2 className="center">Loading contests...</h2>
        </div>
      ) : (
        <div className="wrapper-main">
          {filteredContests && filteredContests.upcomingContests.length > 0 ? (
            <section>
              <h1>
                Upcoming contests ({filteredContests.upcomingContests.length})
              </h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.upcomingContests}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.activeContests.length > 0 ? (
            <section>
              <h1>
                Active contests ({filteredContests.activeContests.length})
              </h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.activeContests}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.sponsorReview.length > 0 ? (
            <section>
              <h1>
                Sponsor review in progress (
                {filteredContests.sponsorReview.length})
              </h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.sponsorReview}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.judging.length > 0 ? (
            <section>
              <h1>Judging in progress ({filteredContests.judging.length})</h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.judging}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.awarding.length > 0 ? (
            <section>
              <h1>Awarding in progress ({filteredContests.awarding.length})</h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.awarding}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.reporting.length > 0 ? (
            <section>
              <h1>
                Reporting in progress ({filteredContests.reporting.length})
              </h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.reporting}
              />
            </section>
          ) : null}
          {filteredContests && filteredContests.completed.length > 0 ? (
            <section>
              <h1>Completed contests ({filteredContests.completed.length})</h1>
              <ContestList
                updateContestStatus={updateContestStatus}
                contests={filteredContests.completed.reverse()}
              />
            </section>
          ) : null}
        </div>
      )}
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
