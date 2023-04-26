import { Octokit } from "@octokit/rest";
import jszip from "jszip";

import { Contest } from "../../types/contest";
import { Finding, OctokitIssuePaginationResponse } from "../../types/finding";
import {
  ContestFindingsRepoName,
  IssueNumber,
  RiskLabelName,
  Username,
} from "../../types/shared";

import { getRiskCodeFromGithubLabel } from "./contest-utils";
import { getUserTeams } from "./user-utils";

/**
 * Shapes an issue response from octokit.paginate into a Finding
 * @param issue // response from octokit.paginate
 * @param wardenName
 * @returns
 */
function shapeOctokitPaginateResponseIntoFinding(
  issue: OctokitIssuePaginationResponse,
  wardenName: Username | undefined
): Finding {
  const riskLabels = [
    "3 (High Risk)",
    "2 (Med Risk)",
    "QA (Quality Assurance)",
    "G (Gas Optimization)",
  ];

  const risk = issue.labels.find((label) => riskLabels.includes(label.name!));
  const labels = issue.labels.map((label) => {
    return {
      color: label.color!,
      name: label.name!,
    };
  });

  return {
    body: issue.body || "",
    labels,
    title: issue.title,
    issueNumber: issue.number,
    risk: (risk?.name as RiskLabelName) || "",
    handle: wardenName || "",
    state: issue.state === "closed" ? "CLOSED" : "OPEN",
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  };
}

/**
 * @param octokit
 * @param repoName
 * @param owner
 * @returns array of all Findings in the given repo
 */
async function getAllFindings(
  octokit: Octokit,
  repoName: ContestFindingsRepoName,
  owner: string
): Promise<Finding[]> {
  const [issuesResponse, wardenNames] = await Promise.all([
    octokit.paginate("GET /repos/{owner}/{repo}/issues", {
      owner,
      repo: repoName,
      state: "all",
      per_page: 100,
    }),
    mapWardenNameToIssueNumber(octokit, repoName),
  ]);

  return (issuesResponse as OctokitIssuePaginationResponse[])
    .map((issue) => {
      return shapeOctokitPaginateResponseIntoFinding(
        issue,
        wardenNames[issue.number]
      );
    })
    .filter((issue) => !issue.title.startsWith("Agreements & Disclosures"));
}

async function mapWardenNameToIssueNumber(
  client: Octokit,
  repo: ContestFindingsRepoName
): Promise<{ [issueNumber: IssueNumber]: Username }> {
  const repoZip = await getRepoZip(client, "code-423n4", repo);
  const files = repoZip.file(new RegExp(`\/data\/.*.json`));
  const wardens: any[] = [];
  for (const f of files) {
    const fileContents = await f.async("text");
    wardens.push(JSON.parse(fileContents));
  }

  const result = wardens.reduce((acc, issue) => {
    acc[issue.issueId.toString()] = issue.handle;
    return acc;
  }, {});
  return result;
}

async function getMarkdownReportForUser(
  client: Octokit,
  repo: ContestFindingsRepoName,
  username: Username,
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
  repo: ContestFindingsRepoName
): Promise<{ handle: Username; issueNumber: IssueNumber }[]> {
  const repoZip = await getRepoZip(client, "code-423n4", repo);
  const files = repoZip.file(new RegExp(`\/data\/.*.json`));
  const wardens: any[] = [];
  for (const f of files) {
    const fileContents = await f.async("text");
    wardens.push(JSON.parse(fileContents));
  }

  const result = wardens.map((issue) => ({
    handle: issue.handle as Username,
    issueNumber: issue.issueId as IssueNumber,
  }));
  return result;
}

export async function getRepoZip(
  octokit: Octokit,
  owner: string,
  repo: ContestFindingsRepoName
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
  username: Username,
  repoName: ContestFindingsRepoName
): Promise<{ handle: Username; issueNumber: IssueNumber }[]> {
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

/**
 * Filters all findings by given warden and reshapes the data to
 * include the content from report markdown and information relevant
 * to mitigation reviews
 * @param octokit
 * @param allFindings
 * @param repoName
 * @param handle
 * @returns Findings by handle
 */
async function getWardenFindingsForContest(
  octokit: Octokit,
  allFindings: Finding[],
  repoName: ContestFindingsRepoName,
  handle: Username
): Promise<Finding[]> {
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

  return await Promise.all(
    allFindings
      .filter((finding) => {
        return finding.handle === handle;
      })
      .map(async (finding) => {
        let body = finding.body;
        const riskLabel = finding.labels.find((label) => {
          return riskLabels.includes(label.name);
        });

        const riskLabelName = riskLabel?.name as RiskLabelName;
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
              octokit,
              repoName,
              handle,
              riskCode
            );
            if (reportBody) {
              body = reportBody;
            }
          }
        }

        const isMitigated = !!finding.labels.find((label) => {
          return label.name === "mitigation-confirmed";
        });

        const mitigationOfLabel = finding.labels.find((label) => {
          return label.name.startsWith("MR-");
        });

        const mitigationOf = mitigationOfLabel
          ? mitigationOfLabel.name.slice(3)
          : undefined;

        const labels = finding.labels.filter((label) => {
          return (
            label.name.startsWith("MR-") || labelsToDisplay.includes(label.name)
          );
        });
        return {
          ...finding,
          labels,
          body,
          isMitigated,
          mitigationOf,
        };
      })
  );
}

// @todo: should this be in contest utils?
function getRepoName(contest: Contest) {
  return contest.findingsRepo.split("/").slice(-1)[0];
}

export {
  getAllFindings,
  getAvailableFindings,
  getWardenFindingsForContest,
  getRepoName,
  getMarkdownReportForUser,
};
