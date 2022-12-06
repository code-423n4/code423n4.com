import { graphql } from "@octokit/graphql";
import format from "date-fns/format";
import dedent from "dedent";
import { createFilePath } from "gatsby-source-filesystem";
import fetch from "node-fetch";
import path from "path";
import webpack from "webpack";
import SchemaCustomization from "./schema";
// Notion
import { Client } from "@notionhq/client";
import { getApiContestData } from "./api/getData.ts";
const { token, notionToken, notionContestDb } = require("./netlify/_config");
const notion = new Client({ auth: notionToken });
const getContestData = async () => {
  try {
    const pages = [];
    let cursor = undefined;
    //cursor is to handle pagination in notion query
    while (true) {
      const { results, next_cursor } = await notion.databases.query({
        database_id: notionContestDb,
        start_cursor: cursor,
        filter: {
          and: [
            {
              property: "ContestID",
              number: {
                is_not_empty: true,
              },
            },
            {
              property: "Status",
              select: {
                does_not_equal: "Lost deal",
              },
            },
            {
              property: "Status",
              select: {
                does_not_equal: "Possible",
              },
            },
          ],
        },
      });
      pages.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }
    const statusObject = pages.map((page) => {
      if (
        page.properties.Status.select.name !== "Lost deal" ||
        page.properties.Status.select.name !== "Possible" ||
        page.properties.Status.select.name ||
        page.properties.ContestID.number
      ) {
        if (page.properties["Classified?"].checkbox === false) {
          return {
            contestId: page.properties.ContestID.number || null,
            status: page.properties.Status.select.name || null,
            codeAccess: "public",
          };
        } else if (
          page.properties["Code access"].select &&
          page.properties["Code access"].select.name.trim() === "Certified only"
        ) {
          return {
            contestId: page.properties.ContestID.number || null,
            status: page.properties.Status.select.name || null,
            codeAccess: "certified",
          };
        } else if (
          page.properties["Code access"].select &&
          page.properties["Code access"].select.name.trim() ===
            "Public (default)"
        ) {
          return {
            contestId: page.properties.ContestID.number || null,
            status: page.properties.Status.select.name || null,
            codeAccess: "public",
          };
        } else {
          return {
            contestId: page.properties.ContestID.number || null,
            status: page.properties.Status.select.name || null,
            codeAccess: null,
          };
        }
      }
    });
    return statusObject;
  } catch (err) {
    return null;
  }
};

const privateContestMessage = dedent`
# Contest details are not available. Why not?

The contest is limited to specific participants. Most Code4rena contests are open and public, but some have special requirements. In those cases, the code and contest details remain private (at least for now).

For more information on participating in a private audit, please see this [post](https://mirror.xyz/c4blog.eth/Ww3sILR-e5iWoMYNpZEB9UME_vA8G0Yqa6TYvpSdEM0).
`;

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

exports.sourceNodes = async ({
  actions,
  getNodes,
  createContentDigest,
  createNodeId
}) => {
  const { createNode, createNodeField } = actions;
  const apiContestsData = await getApiContestData();

  apiContestsData.forEach((contest) => {
    console.log(contest);
    createNode({
      ...contest,
      id: createNodeId(`ContestsCsv-${contest.contestid}`),
      parent: null,
      children: [],
      internal: {
        type: "ContestsCsv",
        contentDigest: createContentDigest(contest),
      },
    });
  });

  const nodes = await getNodes();
  const contestStatusData = await getContestData();

  nodes.forEach((node, index) => {
    if (node.internal.type === `ContestsCsv`) {
      const dataForCurrentContest = contestStatusData.filter(
        (element) => element.contestId === node.contestid
      );

      createNodeField({
        node,
        name: `status`,
        value:
          dataForCurrentContest.length > 0
            ? dataForCurrentContest[0].status
            : undefined,
      });
      createNodeField({
        node,
        name: `codeAccess`,
        value:
          dataForCurrentContest.length > 0
            ? dataForCurrentContest[0].codeAccess
            : undefined,
      });
    }
  });
  return;
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const contests = await graphql(queries.contests);
  // console.log(contests.data.contests.edges);
  const formTemplate = path.resolve("./src/templates/ReportForm.tsx");
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
