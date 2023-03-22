import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";

import DefaultLayout from "../templates/DefaultLayout";
import LeaderboardTableReduced from "../components/LeaderboardTableReduced";

export default function Leaderboard({ data }) {
  const [timeFrame, setTimeFrame] = useState("Last 60 days");
  const [leaderboardResults, setLeaderboardResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contests = data.contests.edges;

  useEffect(() => {
    (async () => {
      const result = await fetch(
        `/.netlify/functions/leaderboard?range=${timeFrame}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "X-Authorization": `Bearer ${sessionToken}`,
            // "C4-User": currentUser.username,
          },
          body: JSON.stringify(contests),
        }
      );
      if (result.ok) {
        setLeaderboardResults(await result.json());
      } else {
        // @TODO: what to do here?
        throw "Unable to fetch leaderboard results.";
      }
      setIsLoading(false);
    })();
  }, [timeFrame]);

  const handleChange = (e) => {
    setIsLoading(true);
    setTimeFrame(e.target.value);
  };

  const filterOptions = [
    { value: "Last 60 days", label: "Last 60 days" },
    { value: "Last 90 days", label: "Last 90 days" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "All time", label: "All time" },
  ];

  return (
    <DefaultLayout pageTitle="Leaderboard" bodyClass="leaderboard">
      <div className="limited-width leaderboard-page">
        <h1 className="type__headline__page-title">Leaderboard</h1>
        <div className="leaderboard__dropdown">
          {/* browser-native select in firefox inherits the dropdown background color from the select element */}
          {/* <label className="select-label">{timeFrame}</label> */}
          <select onChange={handleChange} className="select">
            {filterOptions.map((option, index) => (
              <option value={option.value} key={`${option.value}-${index}`}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="leaderboard__container">
          <LeaderboardTableReduced
            results={leaderboardResults}
            isLoading={isLoading}
          />
        </div>
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
