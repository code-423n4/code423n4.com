import { Octokit } from "@octokit/core";

import { Contest } from "../../types/contest";
import { Finding } from "../../types/finding";

import { getRiskCodeFromGithubLabel } from "./contest-utils";
import { getUserTeams } from "./user-utils";

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
  rateLimit: {
    cost: number;
    limit: number;
    remaining: number;
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

async function getMarkdownReportForUser(
  client: Octokit,
  repo: string,
  username: string,
  reportType: "G" | "Q"
): Promise<string> {
  const reportPath = `data/${username}-${reportType}.md`;
  try {
    const report = await client.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: process.env.GITHUB_CONTEST_REPO_OWNER!,
        repo: repo,
        path: reportPath,
      }
    );
    // @ts-ignore // @todo: fix this typescript error
    return Buffer.from(report.data.content, "base64").toString();
  } catch (error) {
    return "";
  }
}

async function getSubmittedFindingsFromFolder(
  client: Octokit,
  repo: string
): Promise<{ handle: string; issueNumber: number }[]> {
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
              handle: handle as string,
              issueNumber: parseInt(issueNumber),
            };
          })
      );
    });

  return submitted_findings;
}

async function getAvailableFindings(
  client: Octokit,
  username: string,
  contest
) {
  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

  const teamHandles = await getUserTeams(username);

  // get list of submissions, filtering for access / match
  const submission_files = (
    await getSubmittedFindingsFromFolder(client, repoName)
  ).filter((item) => {
    if (item.handle === username || teamHandles.includes(item.handle)) {
      return item;
    }
  });

  return submission_files;
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

  const riskLabels = [
    "3 (High Risk)",
    "2 (Med Risk)",
    "QA (Quality Assurance)",
    "G (Gas Optimization)",
  ];

  const labelsToDisplay = [
    ...riskLabels,
    "edited-by-warden",
    "withdrawn by warden",
  ];

  const submissions = submission_files.map(
    async (item): Promise<Finding> => {
      const labels: { name: string; color: string }[] = github_issues[
        item.issueNumber
      ].labels.nodes.filter((label) => {
        return labelsToDisplay.indexOf(label.name) >= 0;
      });

      let body = github_issues[item.issueNumber].body;

      const riskLabel = labels.find((label) => {
        return riskLabels.includes(label.name);
      });

      const risk = riskLabel!.name;
      const riskCode = getRiskCodeFromGithubLabel(risk);
      if (
        (riskCode === "Q" || riskCode === "G") &&
        // @todo: remove this condition once we can be sure all reports are saved as md files
        body.startsWith("See the markdown file with the details of this report")
      ) {
        const reportBody = await getMarkdownReportForUser(
          client,
          repoName,
          handle,
          riskCode
        );
        if (reportBody) {
          body = reportBody;
        }
      }

      return {
        ...item,
        title: github_issues[item.issueNumber].title,
        body,
        labels,
        risk,
        state: github_issues[item.issueNumber].state,
        createdAt: github_issues[item.issueNumber].createdAt,
        updatedAt: github_issues[item.issueNumber].updatedAt,
      };
    }
  );

  return Promise.all(submissions);
}

// @todo: should this be in contest utils?
function getRepoName(contest: Contest) {
  return contest.findingsRepo.split("/").slice(-1)[0];
}

export {
  QueryResponse,
  getAllIssues,
  getAvailableFindings,
  getSubmittedFindingsFromFolder,
  wardenFindingsForContest,
  getRepoName,
  getMarkdownReportForUser,
};
