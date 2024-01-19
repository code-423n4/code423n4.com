import { Handler } from "@netlify/functions";
import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";
import { Finding, Label } from "../../types/finding";

import { getAllFindings } from "../util/github-utils";

function getRiskFromLabels(labels: Label[]): string {
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

function getIsDuplicateFromLabels(labels: Label[]): boolean {
  return labels.map((l) => l.name).includes("duplicate");
}

function getIsInvalidFromLabels(labels: Label[]): boolean {
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

function simplifyData(issue: Finding): SimplifiedIssue {
  return {
    id: issue.issueNumber,
    title: issue.title,
    risk: getRiskFromLabels(issue.labels),
    isOpen: issue.state === "OPEN",
    isDuplicate: getIsDuplicateFromLabels(issue.labels),
    isInvalid: getIsInvalidFromLabels(issue.labels),
  };
}

function isAuthorized(jwtToken: string, requestedRepo: string): boolean {
  try {
    const verification = jwt.verify(jwtToken, process.env.JWT_SIGNING_TOKEN!);
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
        { H: "3 (High Risk)", M: "2 (Med Risk)" }[issue.risk],
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
    risk: { H: "3", M: "2" }[issue.risk],
    title: issue.title,
    issueId: issueId,
    issueUrl: issueUrl,
  };

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "code-423n4",
    repo,
    path: `data/${issue.handle}-${issueId}.json`,
    message: `Upgrade for ${issue.handle} issue #${issueId}`,
    content: Buffer.from(JSON.stringify(fileData, null, 2)).toString("base64"),
  });

  return {
    statusCode: 200,
    body: JSON.stringify(issueId),
  };
}

async function doUpdateFromGitHub(repo) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const issues = await getAllFindings(octokit, repo, "code-423n4");
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

const handler: Handler = (event) => {
  (async () => {
    try {
      const { authorization } = event.headers;

      if (!authorization) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Authorization required" }),
        };
      }

      const body = JSON.parse(event.body!);
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
  })();
};

export { handler };
