import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import ContestList from "../../components/ContestList";
import DefaultLayout from "../../templates/DefaultLayout";
import { getDates } from "../../utils/time";
export default function Contests({ data }) {
  const [filteredContests, setFilteredContest] = useState(null);
  const [contestStatusChanges, updateContestStatusChanges] = useState(0);
  const contests = data.contests.edges;
  const updateContestStatus = () => {
    updateContestStatusChanges(contestStatusChanges + 1);
  };

  const sortContests = (contestArray) => {
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

    contestArray.forEach((element) => {
      switch (element.node.fields.status) {
        case "Pre-Contest":
        case "Preview week":
          statusObject.upcomingContests.push(element.node);
          break;
        case "Active":
        case "Active Contest":
          statusObject.activeContests.push(element.node);
          break;
        case "Sponsor Review":
        case "Needs Judging":
        case "Judging Complete":
        case "Awarding":
        case "Reporting":
        case "Completed":
          statusObject.completed.push(element.node);
          break;
        case null:
          if (
            getDates(element.node.start_time, element.node.end_time)
              .contestStatus === "active"
          ) {
            statusObject.activeContests.push(element.node);
            console.log("active");
          } else if (
            getDates(element.node.start_time, element.node.end_time)
              .contestStatus === "soon"
          ) {
            statusObject.upcomingContests.push(element.node);
          }
          break;
        default:
          statusObject.other.push(element.node);
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
    if (contests) {
      setFilteredContest(sortContests(contests));
    }
  }, [contests]);

  return (
    <DefaultLayout
      key={"contests" + contestStatusChanges}
      pageTitle="Contests"
      bodyClass="contests-page"
      pageDescription="Current, upcoming, and past audit contests"
    >
      <div className="wrapper-main">
        {filteredContests && filteredContests.activeContests.length > 0 ? (
          <section>
            <h1>Active contests ({filteredContests.activeContests.length})</h1>
            <ContestList
              updateContestStatus={updateContestStatus}
              contests={filteredContests.activeContests}
            />
          </section>
        ) : null}
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
            <h1>Reporting in progress ({filteredContests.reporting.length})</h1>
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
            status
          }
          contestid
        }
      }
    }
  }
`;
