import * as React from "react";
import { graphql } from "gatsby";
import DOMPurify from "isomorphic-dompurify";

import ReportLayout from "../../templates/ReportLayout";

function ReportPageTemplate({ data }) {
  const page = data.markdownRemark;
  
  const scrollToTop = () =>{
    if (typeof window !== undefined) {
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    }
  };

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
            <div className="report-toc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.tableOfContents) }}/>
            <div
              className="report-contents"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.html) }}
            />
          </div>
        </article>
      </div>
      <button className="button floating-button" onClick={scrollToTop}>Top</button>
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
          image {
            childImageSharp {
              resize(width: 200) {
                src
              }
            }
          }
          name
        }
      }
      html
      tableOfContents(maxDepth: 2)
    }
  }
`;

export default ReportPageTemplate;
