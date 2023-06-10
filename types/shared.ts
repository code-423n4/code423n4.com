export type AbsoluteURL = string;
export type RelativeURL = string;
export type ContestSlug = string;
export type ContestNumber = number;
export type WalletAddress = string;
export type UserId = string;
export type Username = string;
export type SupportedChain = "polygon" | "ethereum";
export type IssueState = "OPEN" | "CLOSED";
export type IssueNumber = number;
export type DateString = string;
export type ReportId = string;
export type FindingBody = string;
export type ContestRepoName = string; // YYYY-MM-DD-contestName
export type ContestFindingsRepoName = string; // YYYY-MM-DD-contestName-findings
export type RiskLabelName =
  | "3 (High Risk)"
  | "2 (Med Risk)"
  | "QA (Quality Assurance)"
  | "G (Gas Optimization)";
