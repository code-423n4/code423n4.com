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

async function getSubmittedFindingsFromFolder(repo) {
  // returns handle/issueNumber from ./data/{handle}-{issue}.json files

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const submitted_findings = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
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
        'issueNumber': issueNumber,
      }
    });
  });

  return submitted_findings;
}

async function wardenFindingsForContest(handle, contest) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }); // TODO: move out?

  const repoName = contest.findingsRepo.split("/").slice(-1)[0];

  // get the handle-id mapping from './data'
  const handle_findings = (await getSubmittedFindingsFromFolder(repoName))
    .filter(item => {
      return item.handle === handle
    });

  return handle_findings
    .map(item => {
      // todo: fill in necessary values
      return {
        ...item,
        'id': "The ID???",
        'title': "Placehodler title",
        'body': "The Body (can this be avoided until edit?)",
        'labels': [
          // {"name": "Some Label", "color": "aabb00"}
        ],
        'number': item.issueNumber,
        'state': "some state",
        'createdAt': null,
        'updatedAt': null,
      };
    });
}

export {
  QueryResponse,
  getAllIssues,
  wardenFindingsForContest,
};
