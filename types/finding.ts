import {
  AbsoluteURL,
  ContestNumber,
  DateString,
  FindingBody,
  IssueNumber,
  IssueState,
  ReportId,
  RiskLabelName,
  Username,
  WalletAddress,
} from "./shared";

export enum MitigationStatus {
  MitigationConfirmed = 1,
  Unmitigated,
  New,
}

export interface Finding {
  title: string;
  body: FindingBody;
  labels: Label[];
  risk: RiskLabelName | "";
  state: IssueState;
  createdAt: DateString;
  updatedAt: DateString;
  issueNumber: number;
  handle: string;
  mitigationStatus?: MitigationStatus;
  mitigationOf?: ReportId;
  issueType?: string;
}

export interface Label {
  name: string;
  color: string;
}

export interface FindingEditRequest {
  issue: number;
  contest: number;
  emailAddresses: string[];
  attributedTo: {
    newValue: Username;
    oldValue: Username;
    // @todo: remove this once all teams have a saved polygon address
    address?: WalletAddress;
  };
  risk: {
    newValue: RiskLabelName | "";
    oldValue: RiskLabelName | "";
  };
  title?: string;
  body?: FindingBody;
  mitigationOf?: {
    newValue: ReportId;
    oldValue: ReportId;
  };
  mitigationStatus?: {
    newValue: MitigationStatus;
    oldValue: MitigationStatus;
  };
  issueType?: {
    newValue: string;
    oldValue: string;
  };
}

export interface WardenFindingsForContest {
  user: Finding[];
  teams: {
    [teamName: string]: Finding[];
  };
}

export interface FindingCreateRequest {
  user: Username;
  contest: ContestNumber;
  sponsor: string;
  repo: AbsoluteURL;
  emailAddresses: string[];
  attributedTo: Username;
  risk: RiskLabelName | "";
  title: string;
  body: FindingBody;
  labels: string[];
  address?: WalletAddress;
  mitigationOf?: ReportId;
  mitigationStatus?: MitigationStatus;
  issueType?: string;
}

export interface BotReportCreateRequest {
  contest: ContestNumber;
  botName: Username;
  body: FindingBody;
}

export interface FindingDeleteRequest {
  attributedTo: Username;
  risk: RiskLabelName | "";
  emailAddresses: string[];
}

export interface AwardFinding {
  contest: number;
  handle: string;
  finding: string;
  risk: string;
  score: number | null;
  pie: number;
  split: number;
  slice: number;
  award: number;
  awardCoin: string;
  awardUSD: number;
}

export interface OctokitIssuePaginationResponse {
  title: string;
  number: IssueNumber;
  labels: Label[];
  state: "open" | "closed";
  body: string;
  created_at: string;
  updated_at: string;
}
