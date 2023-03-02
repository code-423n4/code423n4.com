import * as React from "react";
import { graphql } from "gatsby";
import DOMPurify from "isomorphic-dompurify";

import DefaultLayout from "../../templates/DefaultLayout";

function ReportPageTemplate({ data }) {
  const page = data.markdownRemark;

  // TODO: Style this button
  const scrollToTop = () => {
    if (typeof window !== undefined) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <DefaultLayout
      preview=""
      pageDescription=""
      pageTitle={page.frontmatter.title}
      bodyClass="report-page"
    >
      <div className="limited-width type__copy">
        <div className="type__article">
          {page.frontmatter.sponsor ? (
            <img
              className="report-sponsor-logo"
              src={page.frontmatter.sponsor.image.childImageSharp.resize.src}
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
          <div className="report-container">
            <h2>Table of contents</h2>
            <div
              className="report-toc"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(page.tableOfContents),
              }}
            />
            <div
              className="report-contents"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(page.html),
              }}
            />
          </div>
        </div>
      </div>
      <button className="button floating-button" onClick={scrollToTop}>
        Top
      </button>
    </DefaultLayout>
  );
}

export const query = graphql`
  query($id: String!) {
    markdownRemark: reportsJson(id: { eq: $id }) {
      frontmatter: circa {
        title
        date
        sponsor {
          image {
            childImageSharp {
              resize(width: 80) {
                src
              }
            }
          }
          name
        }
      }
      html
      tableOfContents: toc
    }
  }
`;

export default ReportPageTemplate;
