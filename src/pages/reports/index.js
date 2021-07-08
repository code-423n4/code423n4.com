import React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../../layouts/DefaultLayout";
import ReportList from "../../components/ReportList";

export default function ReportIndex({ data }) {
  const reports = data.reports.edges;
  console.log("reports", data);

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
    reports: allMarkdownRemark(
      filter: { fields: { collection: { eq: "reports" } } }
      sort: { fields: frontmatter___contest___contestid }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            findings
            altUrl
            sponsor {
              id
              image {
                childImageSharp {
                  resize(width: 160) {
                    src
                  }
                }
              }
              link
              name
            }
            contest {
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
