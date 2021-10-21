import path from "path";
import SchemaCustomization from "./schema";
import { createFilePath } from "gatsby-source-filesystem";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

function contestSlug(contestNode) {
  const startDate = new Date(contestNode.start_time);
  const year = startDate.getFullYear();
  const month = `${startDate.getMonth() + 1}`.padStart(2, "0");
  const title = slugify(contestNode.title);
  const slug = `${year}-${month}-${title}`;

  return slug;
}

function contestPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}`;
}

function contestSubmissionPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}/submit`;
}

const queries = {
  contests: `query {
    contests: allContestsCsv(sort: { fields: end_time, order: ASC }) {
      edges {
        node {
          id
          contestid
          title
          start_time(formatString: "YYYY-MM")
          findingsRepo
          fields {
            submissionPath
          }
        }
      }
    }
  }
`,
};

exports.createSchemaCustomization = (helpers) => {
  const { actions } = helpers;
  const { createTypes } = actions;
  try {
    createTypes(SchemaCustomization);
  } catch (error) {
    console.log(error);
  }
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    const parent = getNode(node.parent);
    let slug;
    if (node.frontmatter.slug) {
      // if a slug is defined, use that.
      slug = "/" + node.frontmatter.slug;
    } else {
      // otherwise use the file path
      slug = createFilePath({ node, getNode });
    }
    createNodeField({
      node,
      name: `collection`,
      value: parent.sourceInstanceName,
    });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }

  if (node.internal.type === `ContestsCsv`) {
    createNodeField({
      node,
      name: `permalink`,
      value: contestPermalink(node),
    });
    createNodeField({
      node,
      name: `submissionPath`,
      value: contestSubmissionPermalink(node),
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  let contests = await graphql(queries.contests);
  const formTemplate = path.resolve("./src/layouts/ReportForm.js");
  const contestTemplate = path.resolve("./src/layouts/ContestLayout.js");
  contests.data.contests.edges.forEach((contest) => {
    if (contest.node.findingsRepo) {
      createPage({
        path: contest.node.fields.submissionPath,
        component: formTemplate,
        context: {
          contestId: contest.node.contestid,
        },
      });
    }

    // createPage({
    //   path: contest.node.fields.permalink,
    //   component: contestTemplate,
    //   context: {
    //     contestId: contest.node.contestid,
    //   },
    // });
  });
};
