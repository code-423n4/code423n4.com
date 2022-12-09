import React, { useMemo, useState } from "react";
import { differenceInDays, getYear } from "date-fns";

import DefaultLayout from "../templates/DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

const withinLastNDays = (contestEnd, numDays) => {
  return differenceInDays(new Date(), contestEnd) <= numDays;
};

const withinYear = (contestEnd, year) => {
  return getYear(contestEnd) === year;
};

function filterFindingsByTimeFrame(findings, timeFrame) {
  switch (timeFrame) {
    case "Last 60 days":
      return findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 60)
      );
    case "Last 90 days":
      return findings.filter((f) =>
        withinLastNDays(new Date(f.contest.end_time), 90)
      );
    case "2022":
      return findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2022)
      );
    case "2021":
      return findings.filter((f) =>
        withinYear(new Date(f.contest.end_time), 2021)
      );
    default:
      return findings;
  }
}

function computeResults(findings) {
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

  findings.forEach((f) => {
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
  const [timeFrame, setTimeFrame] = useState("2022");

  const handles = /*data.handles.edges*/ [];

  const resultData = useMemo(() => {
    const result = [];

    for (const handle of handles) {
      const p = handle.node;

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

      const filteredFindings = filterFindingsByTimeFrame(p.findings, timeFrame);

      const combinedData = {
        ...handleData,
        ...computeResults(filteredFindings),
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

  const filterOptions = [
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "Last 60 days", label: "Last 60 days" },
    { value: "Last 90 days", label: "Last 90 days" },
    { value: "All time", label: "All time" },
  ];

  return (
    <DefaultLayout pageTitle="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <h1 className="page-header">Leaderboard</h1>
        <div className="dropdown-container">
        {/* browser-native select in firefox inherits the dropdown background color from the select element */}
          <select onChange={handleChange} className="dropdown">
            {filterOptions.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="leaderboard-container">
          <LeaderboardTable results={resultData} />
        </div>
      </div>
    </DefaultLayout>
  );
};

// export const query = graphql`
//   query {
//     handles: allHandlesJson(filter: { showOnLeaderboard: { ne: false } }) {
//       edges {
//         node {
//           handle
//           image {
//             childImageSharp {
//               resize(width: 40) {
//                 src
//               }
//             }
//           }
//           link
//           members {
//             handle
//             image {
//               childImageSharp {
//                 resize(width: 40) {
//                   src
//                 }
//               }
//             }
//             link
//           }
//           findings {
//             awardUSD
//             risk
//             split
//             contest {
//               end_time
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export default Leaderboard;
