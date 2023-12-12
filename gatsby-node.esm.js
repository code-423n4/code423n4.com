import { graphql } from "@octokit/graphql";
import format from "date-fns/format";
import dedent from "dedent";
import { createFilePath } from "gatsby-source-filesystem";
import fetch from "node-fetch";
import path from "path";
import webpack from "webpack";
import SchemaCustomization from "./schema";
import { getApiContestData } from "./netlify/util/getContestsData";

const privateContestMessage = dedent`
## Contest details are not available. Why not?

The contest is limited to specific participants. Most Code4rena contests are open and public, but some have special requirements. In those cases, the code and contest details remain private (at least for now).

For more information on participating in a private audit, please see this [post](https://mirror.xyz/c4blog.eth/Ww3sILR-e5iWoMYNpZEB9UME_vA8G0Yqa6TYvpSdEM0).
`;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN_FETCH}`,
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
  const response = await fetch(
    `https://raw.githubusercontent.com/${
      process.env.GITHUB_CONTEST_REPO_OWNER
    }/${getRepoName(contestNode)}/main/README.md`
  );
  if (response.status === 404) {
    return privateContestMessage;
  }
  const data = await response.text();
  return data;
}

async function fetchSocialImage(contestNode) {
  // @todo: fetch without auth
  const { repository } = await graphqlWithAuth(
    `query socialImage($repo: String!) {
    repository(owner: "${process.env.GITHUB_CONTEST_REPO_OWNER}", name: $repo) {
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
            status
            codeAccess
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

  if (node.internal.type === `ReportsJson`) {
    createNodeField({
      node,
      name: `slug`,
      value: node.circa.slug,
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

    createNodeField({
      node,
      name: "status",
      value: node.status,
    });

    createNodeField({
      node,
      name: "codeAccess",
      value: node.codeAccess,
    });

    if (node.codeAccess === "public") {
      createNodeField({
        node,
        name: `botSubmissionPath`,
        value: contestSubmissionPermalink(node) + "/bot",
      });
    }

    createNodeField({
      node,
      name: "type",
      value: node.type,
    });
  }
};

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;
  const apiContestsData = await getApiContestData();
  apiContestsData.forEach((contest) => {
    const newNode = createNode({
      ...contest,
      contestid: contest.contest_id,
      findingsRepo: contest.findings_repo,
      amount: contest.formatted_amount,
      id: createNodeId(`ContestsCsv-${contest.contest_id}`),
      parent: null,
      children: [],
      internal: {
        type: "ContestsCsv",
        contentDigest: createContentDigest(contest),
      },
    });
  });
  return;
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const contests = await graphql(queries.contests);
  const formTemplate = path.resolve("./src/templates/ReportForm.tsx");
  const botRaceFormTemplate = path.resolve("./src/templates/BotRaceForm.tsx");
  const contestTemplate = path.resolve("./src/templates/ContestLayout.tsx");
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
    if (
      contest.node.fields.codeAccess === "public" &&
      contest.node.contestid !== 241
    ) {
      createPage({
        path: contest.node.fields.submissionPath + "/bot",
        component: botRaceFormTemplate,
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

exports.onCreateWebpackConfig = ({ actions, stage, getConfig }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /canvas/,
        contextRegExp: /jsdom$/,
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
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
        url: require.resolve("url"),
      },
    },
  });
};
