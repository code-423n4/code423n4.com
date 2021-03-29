import React from "react";
import { graphql } from "gatsby";
import { merge } from "lodash";
import DefaultLayout from "../layouts/DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

const riskCount = (findingSet, riskLevel) => {
  return findingSet.reduce(
    (total, finding) =>
      finding.node.risk === riskLevel ? total + 1 : total + 0,
    0
  );
};

const getAwardTotal = (findingSet) => {
  return findingSet.reduce(
    (total, finding) =>
      Number(finding.node.awardUSD) > 0
        ? total + Number(finding.node.awardUSD)
        : total + 0,
    0
  );
};

const Leaderboard = ({ data }) => {
  const findings = data.findings.edges;
  const handles = data.handles.edges;

  const getTotalAwards = (handle) => {
    // filter down to this handle's rewards
    const handleFindings = findings.filter((finding) => {
      if (finding.node.handle) {
        return finding.node.handle.handle === handle;
      }
      if (finding.node && finding.node.handle === null) {
        return console.error(`Missing handle profile json`, finding.node);
      } else return;
    });

    // then total up handleAwards by risk and money
    const lowRisk = riskCount(handleFindings, "1");
    const medRisk = riskCount(handleFindings, "2");
    const highRisk = riskCount(handleFindings, "3");
    const nonCrit = riskCount(handleFindings, "0");
    const gasOptz = riskCount(handleFindings, "g");
    const allFindings = lowRisk + medRisk + highRisk + nonCrit + gasOptz;
    const awardTotal = getAwardTotal(handleFindings).toLocaleString("en-US");

    return {
      lowRisk,
      medRisk,
      highRisk,
      nonCrit,
      gasOptz,
      allFindings,
      awardTotal,
    };
  };

  let resultData = [];

  for (const handle of handles) {
    let p = handle.node;

    if (!resultData[p.handle]) {
      const handleData = {
        handle: p.handle,
        image: p.image,
        link: p.link,
        members: p.members,
      };
      const handleResults = getTotalAwards(p.handle);
      const combinedData = merge(handleData, handleResults);
      if (handleResults.allFindings > 0) {
        resultData.push(combinedData);
      }
    }
  }

  // const handlesJson = <pre><code>{JSON.stringify(resultData,null,2)}</code></pre>
  return (
    <DefaultLayout title="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <LeaderboardTable results={resultData} />
      </div>
    </DefaultLayout>
  );
};

export const query = graphql`
  query {
    findings: allFindingsJson {
      edges {
        node {
          handle {
            handle
          }
          award
          awardUSD
          split
          risk
        }
      }
    }
    handles: allHandlesJson {
      edges {
        node {
          handle
          image
          link
          members {
            handle
            image
            link
          }
        }
      }
    }
  }
`;

export default Leaderboard;
