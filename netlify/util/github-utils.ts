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

async function wardenFindingsForContest(handle, contest) {

}

export {
  QueryResponse,
  getAllIssues,
  wardenFindingsForContest,
};
