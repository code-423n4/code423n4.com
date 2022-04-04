import path from "path";
import webpack from "webpack";
import { createFilePath } from "gatsby-source-filesystem";
import { Octokit } from "@octokit/core";
import { graphql } from "@octokit/graphql";
import format from "date-fns/format";

import SchemaCustomization from "./schema";

const { token } = require("./functions/_config");

const octokit = new Octokit({
  auth: token,
});

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${token}`,
  },
});

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
  const title = slugify(contestNode.title);
  const slug = `${format(startDate, "yyyy-MM")}-${title}`;

  return slug;
}

function contestPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}`;
}

function contestSubmissionPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}/submit`;
}

function getRepoName(contestNode) {
  const regex = "([^/]+$)";
  const url = contestNode.repo;

  const result = url.match(regex);
  const repoName = result[0];
  return repoName;
}

async function fetchReadmeMarkdown(contestNode) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/readme", {
    owner: "code-423n4",
    repo: `${getRepoName(contestNode)}`,
    headers: {
      accept: "application/vnd.github.v3.html+json",
    },
  });

  return data;
}

async function fetchSocialImage(contestNode) {
  const { repository } = await graphqlWithAuth(
    `query socialImage($repo: String!) {
    repository(owner: "code-423n4", name: $repo) {
      openGraphImageUrl
      usesCustomOpenGraphImage
    }
  }`,
    {
      repo: getRepoName(contestNode),
    }
  );
  if (repository.usesCustomOpenGraphImage) {
    return repository.openGraphImageUrl;
  }

  return null;
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
            contestPath
            readmeContent
            artPath
          }
        }
      }
    }
  }
`,
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  try {
    createTypes(SchemaCustomization);
  } catch (error) {
    console.log(error);
  }
};

exports.onCreateNode = async ({ node, getNode, actions }) => {
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
      name: `contestPath`,
      value: contestPermalink(node),
    });

    createNodeField({
      node,
      name: `submissionPath`,
      value: contestSubmissionPermalink(node),
    });

    const readmeMarkdown = await fetchReadmeMarkdown(node);
    createNodeField({
      node,
      name: `readmeContent`,
      value: readmeMarkdown,
    });

    const socialImageUrl = await fetchSocialImage(node);
    createNodeField({
      node,
      name: `artPath`,
      value: socialImageUrl,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const contests = await graphql(queries.contests);
  const formTemplate = path.resolve("./src/templates/ReportForm.js");
  const contestTemplate = path.resolve("./src/templates/ContestLayout.js");
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

    createPage({
      path: contest.node.fields.contestPath,
      component: contestTemplate,
      context: {
        contestId: contest.node.contestid,
      },
    });
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
      }),
    ],
    resolve: {
      fallback: {
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify"),
      },
    },
  });
};
