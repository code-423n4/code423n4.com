import React from "react";
import { graphql } from "gatsby";

import DefaultLayout from "../../templates/DefaultLayout";
import ReportList from "../../components/ReportList";

export default function ReportIndex({ data }) {
  const reports = data.reports.edges;

  return (
    <DefaultLayout pageTitle="Security Audit Reports" bodyClass="reports-page">
      <section className="limited-width">
        <h1 className="type__headline__page-title">Audit Reports</h1>
        <div className="grid__one-by-three--break-m-s">
          {reports ? (
            <ReportList reports={reports} />
          ) : (
            "No reports yet. You can add one in the `_reports` directory."
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    reports: allReportsJson(sort: { fields: circa___contest___contestid }) {
      edges {
        node {
          id
          frontmatter: circa {
            title
            slug
            findings
            altUrl
            date
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
