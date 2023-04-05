import { Octokit } from "@octokit/rest";
import jszip from "jszip";

import { Contest } from "../../types/contest";
import { Finding, OctokitIssuePaginationResponse } from "../../types/finding";

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
  repoName: string,
  owner: string
): Promise<OctokitIssuePaginationResponse[]> {
  const issuesResponse = await client.paginate(
    "GET /repos/{owner}/{repo}/issues",
    {
      owner,
      repo: repoName,
      state: "all",
      per_page: 100,
    }
  );
  return issuesResponse as OctokitIssuePaginationResponse[];
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
  const repoZip = await getRepoZip(client, "code-423n4", repo);
  const files = repoZip.file(new RegExp(`\/data\/.*.json`));
  const wardens: any[] = [];
  for (const f of files) {
    const fileContents = await f.async("text");
    wardens.push(JSON.parse(fileContents));
  }

  const result = wardens.map((issue) => ({
    handle: issue.handle as string,
    issueNumber: issue.issueId as number,
  }));
  return result;
}

export async function getRepoZip(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<jszip> {
  const res = await octokit.rest.repos
    .downloadZipballArchive({
      owner,
      repo,
      ref: "main",
    })
    .then((res) => {
      return jszip.loadAsync(res.data as Buffer);
    });

  return res;
}

async function getAvailableFindings(
  client: Octokit,
  username: string,
  repoName: string
) {
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

async function getWardenFindingsForContest(
  client: Octokit,
  handle: string,
  repoName: string
): Promise<Finding[]> {
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
    "mitigation-confirmed",
  ];

  const submissions = submission_files.map(
    async (item): Promise<Finding> => {
      const labels: { name: string; color: string }[] = github_issues[
        item.issueNumber
      ].labels.filter((label) => {
        return (
          label.name.startsWith("MR-") ||
          labelsToDisplay.indexOf(label.name) >= 0
        );
      });

      let body = github_issues[item.issueNumber].body;

      const riskLabel = labels.find((label) => {
        return riskLabels.includes(label.name);
      });

      const riskLabelName = riskLabel?.name;

      if (riskLabelName) {
        const riskCode = getRiskCodeFromGithubLabel(riskLabelName);
        if (
          (riskCode === "Q" || riskCode === "G") &&
          // @todo: remove this condition once we can be sure all reports are saved as md files
          body.startsWith(
            "See the markdown file with the details of this report"
          )
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
      }

      const isMitigated = !!labels.find((label) => {
        return label.name === "mitigation-confirmed";
      });

      const mitigationOfLabel = labels.find((label) => {
        return label.name.startsWith("MR-");
      });

      const mitigationOf = mitigationOfLabel
        ? mitigationOfLabel.name.slice(3)
        : undefined;

      return {
        ...item,
        title: github_issues[item.issueNumber].title,
        body,
        labels,
        risk: riskLabelName || "",
        state: github_issues[item.issueNumber].state.toUpperCase(),
        createdAt: github_issues[item.issueNumber].created_at,
        updatedAt: github_issues[item.issueNumber].updated_at,
        isMitigated,
        mitigationOf,
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
  getWardenFindingsForContest,
  getRepoName,
  getMarkdownReportForUser,
};
