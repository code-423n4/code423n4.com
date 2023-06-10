import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";

import DefaultLayout from "../templates/DefaultLayout";
import LeaderboardTableReduced from "../components/LeaderboardTableReduced";

export default function Leaderboard() {
  const [timeFrame, setTimeFrame] = useState("Last 60 days");
  const [leaderboardResults, setLeaderboardResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await fetch(
        `/.netlify/functions/leaderboard?range=${timeFrame}`,
        {
          headers: {
            "Content-Type": "application/json",
            // "X-Authorization": `Bearer ${sessionToken}`,
            // "C4-User": currentUser.username,
          },
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
