import { Handler } from "@netlify/functions";
import { Octokit } from "@octokit/core";
import jwt from "jsonwebtoken";

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
            }
          }
          number
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    rateLimit {
      cost
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
            }
          }
          number
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    rateLimit {
      cost
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
  console.log("getting first page");
  const response = await client.graphql<QueryResponse>(firstPageQuery, {
    name,
    owner,
  });
  console.log(response);
  return response;
}

async function getNthPage(
  client: Octokit,
  name: string,
  owner: string,
  after: string
): Promise<QueryResponse> {
  console.log(`getting nth page after ${after}`);
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

function getRiskFromLabels(
  labels: QueryResponse["repository"]["issues"]["nodes"][number]["labels"]["nodes"]
): string {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].name === "invalid") {
      return "INVALID";
    } else if (labels[i].name === "0 (Non-critical)") {
      return "N";
    } else if (labels[i].name === "1 (Low Risk)") {
      return "L";
    } else if (labels[i].name === "2 (Med Risk)") {
      return "M";
    } else if (labels[i].name === "3 (High Risk)") {
      return "H";
    } else if (labels[i].name === "G (Gas Optimization)") {
      return "G";
    } else if (labels[i].name === "QA (Quality Assurance)") {
      return "Q";
    }
  }

  return "";
}

function getIsDuplicateFromLabels(
  labels: QueryResponse["repository"]["issues"]["nodes"][number]["labels"]["nodes"]
): boolean {
  return labels.map((l) => l.name).includes("duplicate");
}

function getIsInvalidFromLabels(
  labels: QueryResponse["repository"]["issues"]["nodes"][number]["labels"]["nodes"]
): boolean {
  return labels.map((l) => l.name).includes("invalid");
}

interface SimplifiedIssue {
  id: number;
  title: string;
  risk: string;
  isOpen: boolean;
  isDuplicate: boolean;
  isInvalid: boolean;
}

function simplifyData(
  issue: QueryResponse["repository"]["issues"]["nodes"][number]
): SimplifiedIssue {
  return {
    id: issue.number,
    title: issue.title,
    risk: getRiskFromLabels(issue.labels.nodes),
    isOpen: issue.state === "OPEN",
    isDuplicate: getIsDuplicateFromLabels(issue.labels.nodes),
    isInvalid: getIsInvalidFromLabels(issue.labels.nodes),
  };
}

function isAuthorized(jwtToken: string, requestedRepo: string): boolean {
  try {
    const verification = jwt.verify(jwtToken, process.env.JWT_SIGNING_TOKEN);
    if (typeof verification === "string") {
      return false;
    }

    const { repo } = verification;
    return repo === requestedRepo;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function createUpgradedIssue(repo, issue) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // create issue
  const issueResult = await octokit.request(
    "POST /repos/{owner}/{repo}/issues",
    {
      owner: "code-423n4",
      repo,
      title: issue.title,
      body: issue.body,
      labels: [
        "bug",
        "upgraded by judge",
        {"H": "3 (High Risk)", "M": "2 (Med Risk)"}[issue.risk],
      ],
    }
  );

  const issueId = issueResult.data.number;
  const issueUrl = issueResult.data.html_url;
  
  // create submission file
  const fileData = {
    contest: issue.contest,
    handle: issue.handle,
    address: issue.address,
    risk: {"H": "3", "M": "2"}[issue.risk],
    title: issue.title,
    issueId: issueId,
    issueUrl: issueUrl,
  };

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "code-423n4",
    repo,
    path: `data/${issue.handle}-${issueId}.json`,
    message: `Upgrade for ${issue.handle} issue #${issueId}`,
    content: Buffer.from(JSON.stringify(fileData, null, 2)).toString(
      "base64"
    ),
  });

  return {
    statusCode: 200,
    body: JSON.stringify(issueId),
  }
}

async function doUpdateFromGitHub(repo) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const issues = await getAllIssues(octokit, repo, "code-423n4");
  const response = issues
    .map(simplifyData)
    .reduce<Record<number, SimplifiedIssue>>((a, b) => {
      a[b.id] = b;
      return a;
    }, {});

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

const handler: Handler = async (event, context) => {
  try {
    const { authorization } = event.headers;

    if (!authorization) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authorization required" }),
      };
    }

    const body = JSON.parse(event.body);
    const { name } = body;

    if (!isAuthorized(authorization, name)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authorization failed" }),
      };
    }

    const { action, args } = body;

    switch (action) {
      case "update-from-github":
        return await doUpdateFromGitHub(name);
      case "upgrade-submission":
        return await createUpgradedIssue(name, args);
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
