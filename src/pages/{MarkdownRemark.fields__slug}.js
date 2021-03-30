import * as React from "react";
import { graphql } from "gatsby";
import DefaultLayout from "../layouts/DefaultLayout";

function PageTemplate({ data }) {
  const page = data.markdownRemark;
  console.log(data);
  return (
    <DefaultLayout title={page.frontmatter.title} bodyClass="page">
      <article>
        <h1>{page.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
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
