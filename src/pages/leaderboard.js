import React, { useMemo, useState } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../templates/DefaultLayout";
import { differenceInDays, getYear } from "date-fns";
import LeaderboardTable from "../components/LeaderboardTable";

const withinLastNDays = (contestEnd, numDays) => {
  differenceInDays(new Date(), contestEnd) <= numDays &&
    console.log(
      `within last ${numDays} days? => ${differenceInDays(
        new Date(),
        contestEnd
      )}`
    );
  return differenceInDays(new Date(), contestEnd) <= numDays;
};

const withinYear = (contestEnd, year) => {
  return getYear(contestEnd) === year;
};

function computeResults(findings, timeFrame) {
  const results = {
    lowRisk: 0,
    medRisk: 0,
    highRisk: 0,
    soloMed: 0,
    soloHigh: 0,
    nonCrit: 0,
    gasOptz: 0,
    allFindings: 0,
    awardTotal: 0,
  };

  let filteredFindings = findings;
  switch (timeFrame) {
    case "Last 30 days":
      filteredFindings = findings.filter((f) => {
        return withinLastNDays(new Date(f.contest.end_time), 30);
      });
      break;
    case "Last 60 days":
      filteredFindings = findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 60)
      );
      break;
    case "Last 90 days":
      filteredFindings = findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 90)
      );
      break;
    case "2022":
      filteredFindings = findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2022)
      );
      break;
    case "2021":
      filteredFindings = findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2021)
      );
      break;
    default:
      filteredFindings = findings;
      break;
  }

  filteredFindings.forEach((f) => {
    results.allFindings += 1;
    results.awardTotal += f.awardUSD ?? 0;

    switch (f.risk.toLowerCase()) {
      case "0":
        results.nonCrit += 1;
        break;
      case "1":
        results.lowRisk += 1;
        break;
      case "2":
        results.medRisk += 1;
        if (f.split === 1) {
          results.soloMed += 1;
        }
        break;
      case "3":
        results.highRisk += 1;
        if (f.split === 1) {
          results.soloHigh += 1;
        }
        break;
      case "g":
        results.gasOptz += 1;
        break;
      default:
        break;
    }
  });

  return results;
}

const Leaderboard = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState(null);

  const handles = data.handles.edges;

  const resultData = useMemo(() => {
    let result = [];

    for (const handle of handles) {
      let p = handle.node;

      const handleData = {
        handle: p.handle,
        image: p.image,
        link: p.link,
        members: p.members,
        lowRisk: 0,
        medRisk: 0,
        soloMed: 0,
        highRisk: 0,
        soloHigh: 0,
        nonCrit: 0,
        gasOptz: 0,
        allFindings: 0,
        awardTotal: 0,
      };

      const combinedData = {
        ...handleData,
        ...computeResults(p.findings, timeFrame),
      };
      if (combinedData.allFindings > 0) {
        result.push(combinedData);
      }
    }
    return result;
  }, [handles, timeFrame]);

  const handleChange = (e) => {
    setTimeFrame(e.target.value);
  };

  return (
    <DefaultLayout pageTitle="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <h1 className="page-header">Leaderboard</h1>
        <select onChange={handleChange}>
          <option value="All time">All time</option>
          <option value="Last 30 days">Last 30 days</option>
          <option value="Last 60 days">Last 60 days</option>
          <option value="Last 90 days">Last 90 days</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <LeaderboardTable results={resultData} />
      </div>
    </DefaultLayout>
  );
};

export const query = graphql`
  query {
    handles: allHandlesJson(filter: { showOnLeaderboard: { ne: false } }) {
      edges {
        node {
          handle
          image {
            childImageSharp {
              resize(width: 40) {
                src
              }
            }
          }
          link
          members {
            handle
            image {
              childImageSharp {
                resize(width: 40) {
                  src
                }
              }
            }
            link
          }
          findings {
            awardUSD
            risk
            split
            contest {
              end_time
            }
          }
        }
      }
    }
  }
`;

export default Leaderboard;
