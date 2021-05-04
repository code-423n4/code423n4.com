import * as React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";

function PageTemplate({ data }) {
  const page = data.markdownRemark;

  return (
    <DefaultLayout title={page.frontmatter.title} bodyClass="page">
      <div className="wrapper-main">
        <article>
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>
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
