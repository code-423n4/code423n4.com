import * as React from "react";
import { graphql } from "gatsby";
import DOMPurify from "isomorphic-dompurify";

import DefaultLayout from "../templates/DefaultLayout";

function PageTemplate({ data }) {
  const page = data.markdownRemark;

  return (
    <DefaultLayout title={page.frontmatter.title} bodyClass="page">
      <div className="limited-width type__copy">
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.html) }}
        />
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
      }
      html
    }
  }
`;

export default PageTemplate;
