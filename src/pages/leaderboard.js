import React from "react";
import { graphql } from "gatsby";
import { merge } from "lodash";
import DefaultLayout from "../layouts/DefaultLayout";
import LeaderboardTable from "../components/LeaderboardTable";

const riskCount = (findingSet, riskLevel) => {
  return findingSet.reduce((total, finding) => finding.node.risk === riskLevel ? total + 1 : total + 0, 0)
}

const getAwardTotal = (findingSet) => {
  return findingSet.reduce((total, finding) => finding.node.award > 0 ? total + finding.node.award : total + 0, 0);
}

const Leaderboard = ({ data }) => {
  console.log(data);
  const findings = data.findings.edges;
  const people = data.people.edges;
  
  const getTotalAwards = (handle) => {
    // filter down to this handle's rewards
    const handleFindings = findings.filter((finding) => {
      if (finding.node.handle) {
        return finding.node.handle.handle === handle;
      } else return;
    })
    
    // then total up handleAwards by risk and money
    const lowRisk = riskCount(handleFindings, "1");
    const medRisk = riskCount(handleFindings, "2");
    const highRisk = riskCount(handleFindings, "3");
    const allFindings = lowRisk + medRisk + highRisk; 
    const awardTotal = getAwardTotal(handleFindings);
    
    return {
      lowRisk,
      medRisk,
      highRisk,
      allFindings,
      awardTotal
    }
  }
  
  let resultData = [];
  
  for (const person of people) {
    let p = person.node
    if (!resultData[p.handle]) {
      const personData = {
        "handle": p.handle, 
        "image": p.image, 
        "link": p.link
      }
      const personResults = getTotalAwards(p.handle);
      const combinedData = merge(personData, personResults)
      if (personResults.allFindings > 0) {
        resultData.push(combinedData);
      } 
    }
  }
  
  // const peopleJson = <pre><code>{JSON.stringify(resultData,null,2)}</code></pre>
  return (
    <DefaultLayout title="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <section>
          <LeaderboardTable results={resultData} />
        </section>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    findings: allFindingsJson {
      edges {
        node {
          award
          handle {
            handle
          }
          risk
        }
      }
    }
    people: allPeopleJson {
      edges {
        node {
          handle
          image
          link
        }
      }
    }
  }
`;

export default Leaderboard;