import { Octokit } from "@octokit/core";
import { Finding } from "../../types/findings";

const firstPageQuery = `
query ($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      issues(first: 100) {
        nodes {
          id
          title
          state
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
          number
          body
          createdAt
          updatedAt
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    rateLimit {
      cost
      limit
      remaining
    }
  }  
`;

const nthPageQuery = `
query ($name: String!, $owner: String!, $after: String!) {
    repository(name: $name, owner: $owner) {
      issues(first: 100, after: $after) {
        nodes {
          id
          title
          state
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
          number
          body
          createdAt
          updatedAt
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    rateLimit {
      cost
      limit
      remaining
    }
  }  
`;

interface QueryResponse {
  repository: {
    issues: {
      nodes: {
        id: string;
        title: string;
        state: "OPEN" | "CLOSED";
        labels: {
          nodes: {
            name: string;
            color: string;
          }[];
        };
        number: number;
      }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

async function getFirstPage(
  client: Octokit,
  name: string,
  owner: string
): Promise<QueryResponse> {
  const response = await client.graphql<QueryResponse>(firstPageQuery, {
    name,
    owner,
  });
  return response;
}

async function getNthPage(
  client: Octokit,
  name: string,
  owner: string,
  after: string
): Promise<QueryResponse> {
  const response = await client.graphql<QueryResponse>(nthPageQuery, {
    name,
    owner,
    after,
  });
  return response;
}

async function getAllIssues(
  client: Octokit,
  name: string,
  owner: string
): Promise<QueryResponse["repository"]["issues"]["nodes"]> {
  const issues: QueryResponse["repository"]["issues"]["nodes"] = [];

  let previousPage = await getFirstPage(client, name, owner);
  issues.push(...previousPage.repository.issues.nodes);

  let hasNextPage = previousPage.repository.issues.pageInfo.hasNextPage;
  while (hasNextPage) {
    const after = previousPage.repository.issues.pageInfo.endCursor;
    let nextPage = await getNthPage(client, name, owner, after);
    issues.push(...nextPage.repository.issues.nodes);
    hasNextPage = nextPage.repository.issues.pageInfo.hasNextPage;
    if (hasNextPage) {
      previousPage = nextPage;
    }
  }

  return issues;
}

async function getSubmittedFindingsFromFolder(client: Octokit, repo) {
  // returns handle/issueNumber from ./data/{handle}-{issue}.json files

  const submitted_findings = await client
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: process.env.GITHUB_CONTEST_REPO_OWNER!,
      repo: repo,
      path: "data",
    })
    .then((res) => {
      return (
        Object.values(res.data)
          // filter out .md files
          .filter((f) => {
            const [key, ext] = f.name.split(".");
            return ext === "json";
          })
          .map((f) => {
            const [key, ext] = f.name.split(".");
            const [handle, issueNumber] = key.split("-");

            return {
              handle: handle,
              issueNumber: parseInt(issueNumber),
            };
          })
      );
    });

  return submitted_findings;
}

async function wardenFindingsForContest(
  client: Octokit,
  handle,
  contest
): Promise<Finding[]> {
  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

  // get the handle-id mapping from './data'
  const submission_files = (
    await getSubmittedFindingsFromFolder(client, repoName)
  ).filter((item) => {
    return item.handle === handle;
  });

  // todo: stitch submissions and issues
  const github_issues = (
    await getAllIssues(client, repoName, process.env.GITHUB_CONTEST_REPO_OWNER!)
  )
    .filter((issue) => {
      return (
        submission_files.find((submission_file) => {
          return submission_file.issueNumber === issue.number;
        }) !== undefined
      );
    })
    .reduce((issues, issue) => {
      issues[issue.number] = issue;
      return issues;
    }, {});

  const submissions = submission_files.map((item) => {
    const labels = github_issues[item.issueNumber].labels.nodes
      .filter((label) => {
        return (
          [
            "3 (High Risk)",
            "2 (Med Risk)",
            "QA (Quality Assurance)",
            "G (Gas Optimization)",
          ].indexOf(label.name) >= 0
        );
      })
      .map((label) => {
        return {
          name: label.name,
          color: label.color,
        };
      });

    const riskLabel = github_issues[item.issueNumber].labels.nodes.find(
      (label) => {
        return [
          "3 (High Risk)",
          "2 (Med Risk)",
          "QA (Quality Assurance)",
          "G (Gas Optimization)",
        ].includes(label.name);
      }
    );

    const risk = riskLabel.name;
    // @todo: extract lines of code from issue body for medium and high issues
    const linksToCode = [];

    return {
      ...item,
      title: github_issues[item.issueNumber].title,
      body: github_issues[item.issueNumber].body,
      labels,
      risk,
      state: github_issues[item.issueNumber].state, // OPEN | CLOSED
      createdAt: github_issues[item.issueNumber].createdAt,
      updatedAt: github_issues[item.issueNumber].updatedAt,
      linksToCode,
    };
  });

  return submissions;
}

export {
  QueryResponse,
  getAllIssues,
  getSubmittedFindingsFromFolder,
  wardenFindingsForContest,
};
