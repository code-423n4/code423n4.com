import React from "react";
import { graphql } from "gatsby";

import DefaultLayout from "../../templates/DefaultLayout";
import ReportList from "../../components/ReportList";

export default function ReportIndex({ data }) {
  const reports = data.reports.edges;

  return (
    <DefaultLayout pageTitle="Security Audit Reports" bodyClass="report-page">
      <div className="wrapper-main">
        <section>
          <h1 className="page-header">Audit Reports</h1>
          <div className="wrapper-report">
            {reports ? (
              <ReportList reports={reports} />
            ) : (
              "No reports yet. You can add one in the `_reports` directory."
            )}
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    reports: allReportsJson(
      sort: { fields: circa___contest___contestid }
    ) {
      edges {
        node {
          id
          frontmatter: circa {
            title
            slug
            findings
            altUrl
            sponsor {
              id
              image {
                childImageSharp {
                  resize(width: 80) {
                    src
                  }
                }
              }
              link
              name
            }
            contest {
              contestid
              end_time
              start_time
              title
              repo
              amount
              details
            }
          }
        }
      }
    }
  }
`;
