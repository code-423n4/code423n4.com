import { Octokit } from "@octokit/core";


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

async function getSubmittedFindingsFromFolder(client : Octokit, repo) {
  // returns handle/issueNumber from ./data/{handle}-{issue}.json files

  const submitted_findings = await client.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: process.env.GITHUB_CONTEST_REPO_OWNER,
    repo: repo,
    path: "data",
  }).then(res => {
    return res.data.map(f => {
      const [key, ext] = f.name.split(".");
      const [handle, issueNumber] = key.split("-");

      // xxx: md submissions?
      // if (ext !== "json") {
      //   console.log("non-json file");
      // }

      return {
        'handle': handle,
        'issueNumber': parseInt(issueNumber),
      }
    });
  });

  return submitted_findings;
}

async function wardenFindingsForContest(client : Octokit, handle, contest) {
  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

  // get the handle-id mapping from './data'
  const submission_files = (await getSubmittedFindingsFromFolder(client, repoName))
    .filter(item => {
      return item.handle === handle
    });

  // todo: stitch submissions and issues
  const github_issues = (await getAllIssues(client, repoName, process.env.GITHUB_CONTEST_REPO_OWNER))
    .filter(issue => {
      return submission_files.find(submission_file => {
        return submission_file.issueNumber === issue.number;
      }) !== undefined;
    })
    .reduce((issues, issue) => {
      issues[issue.number] = issue;
      return issues;
    }, {});

  const submissions = submission_files
    .map(item => {
      // todo: fill in necessary values
      return {
        ...item,
        'title': github_issues[item.issueNumber].title,
        'labels': [
          // {"name": "Some Label", "color": "aabb00"}
        ],
        'state': "OPEN", // OPEN | CLOSED
        'createdAt': null,
        'updatedAt': null,
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
