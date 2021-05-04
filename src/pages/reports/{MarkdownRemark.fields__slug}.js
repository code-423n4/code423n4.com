import * as React from "react";
import { graphql } from "gatsby";
import ReportLayout from "../../layouts/ReportLayout";

function ReportPageTemplate({ data }) {
  const page = data.markdownRemark;
  console.log("page", page);

  return (
    <ReportLayout
      preview=""
      pageDescription=""
      pageTitle={page.frontmatter.title}
      bodyClass="report-page page"
    >
      <div className="wrapper-main">
        <article>
          {page.frontmatter.sponsor ? (
            <img
              className="report-sponsor-logo"
              src={page.frontmatter.sponsor.image}
              alt={page.frontmatter.sponsor.name}
            />
          ) : (
            ""
          )}
          <div className="report-header">
            <h1>
              {page.frontmatter.title} <br /> Findings & Analysis Report
            </h1>
            <h4>{page.frontmatter.date}</h4>
          </div>
          <div
            className="report-contents"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </article>
      </div>
    </ReportLayout>
  );
}

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        date
        sponsor {
          image
          name
        }
      }
      html
    }
  }
`;

export default ReportPageTemplate;
