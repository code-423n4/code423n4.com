import React, { useMemo } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

function computeResults(findings) {
  const results = {
    lowRisk: 0,
    medRisk: 0,
    highRisk: 0,
    nonCrit: 0,
    gasOptz: 0,
    allFindings: 0,
    awardTotal: 0,
  };

  findings.forEach((f) => {
    results.allFindings += 1;
    results.awardTotal += f.awardUSD ?? 0;

    switch (f.risk) {
      case "0":
        results.nonCrit += 1;
        break;
      case "1":
        results.lowRisk += 1;
        break;
      case "2":
        results.medRisk += 1;
        break;
      case "3":
        results.highRisk += 1;
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
        highRisk: 0,
        nonCrit: 0,
        gasOptz: 0,
        allFindings: 0,
        awardTotal: 0,
      };

      const combinedData = { ...handleData, ...computeResults(p.findings) };
      if (combinedData.allFindings > 0) {
        result.push(combinedData);
      }
    }

    return result;
  }, [data]);

  return (
    <DefaultLayout title="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <h1 className="page-header">Leaderboard</h1>
        <LeaderboardTable results={resultData} />
      </div>
    </DefaultLayout>
  );
};

export const query = graphql`
  query {
    handles: allHandlesJson {
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
          }
        }
      }
    }
  }
`;

export default Leaderboard;
