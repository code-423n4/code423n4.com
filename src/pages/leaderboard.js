import React from "react";
import { graphql } from "gatsby";
import { flatten, find } from "lodash";
import DefaultLayout from "../layouts/DefaultLayout";

export default function Leaderboard({ data }) {
  console.log(data);
  const findings = data.findings.edges;
  const people = data.people.edges;
  
  const getTotalAwards = (handle) => {
    // filter down to just this handle's rewards
    var handleFindings = findings.filter((finding) => {
      if (finding.node.handle) {
        return finding.node.handle.handle === handle;
      } else return;
    })
    
    // then total up handleAwards by risk and money
    
    let lowRisk = handleFindings.reduce((total, finding) => finding.node.risk === "1" ? total + 1 : total + 0, 0)
    let medRisk = handleFindings.reduce((total, finding) => finding.node.risk === "2" ? total + 1 : total + 0, 0)
    let highRisk = handleFindings.reduce((total, finding) => finding.node.risk === "3" ? total + 1 : total + 0, 0)
    let awards = handleFindings.reduce((total, finding) => finding.node.award > 0 ? total + finding.node.award : total + 0, 0)
    console.log(handle,'»', 'lowrisk:', lowRisk, 'medrisk:', medRisk, 'highrisk:', highRisk, 'awards:', awards);
    // }
    
    // then return that object for each handle
    return handleFindings;
  }
  
  let groupedResults = [];
  
  for (const person of people) {
    let p = person.node
    if (!groupedResults[p.handle]) {
      groupedResults.push(
        { 
          "handle": p.handle, 
          "image": p.image, 
          "link": p.link, 
          "results": getTotalAwards(p.handle) 
        }
      );
    }
  }
  
  const peopleJson = <pre><code>{JSON.stringify(people,null,2)}</code></pre>
  const findingsJson = <pre><code>{JSON.stringify(findings,null,2)}</code></pre>
  return (
    <DefaultLayout title="Leaderboard" bodyClass="leaderboard">
      <div className="wrapper-main">
        <section>{peopleJson} {findingsJson}</section>
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
