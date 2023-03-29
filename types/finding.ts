import {
  DateString,
  FindingBody,
  IssueState,
  ReportId,
  Username,
  WalletAddress,
} from "./shared";

export interface Finding {
  title: string;
  body: FindingBody;
  labels: {
    name: string;
    color: string;
  }[];
  risk: string; // @todo add enum for risk
  state: IssueState;
  createdAt: DateString;
  updatedAt: DateString;
  issueNumber: number;
  handle: string;
  isMitigated?: boolean;
  mitigationOf?: ReportId;
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
    newValue: string;
    oldValue: string;
  };
  title?: string;
  body?: FindingBody;
  mitigationOf?: {
    newValue: ReportId;
    oldValue: ReportId;
  };
  isMitigated?: {
    newValue: boolean;
    oldValue: boolean;
  };
}

export interface WardenFindingsForContest {
  user: Finding[];
  teams: {
    [teamName: string]: Finding[];
  };
}

export interface TeamFindings {
  findings: Finding[];
  teamName: string;
}

export interface FindingCreateRequest {
  user: Username;
  contest: string;
  sponsor: string;
  repo: string;
  emailAddresses: string[];
  attributedTo: Username;
  risk: string;
  title: string;
  body: FindingBody;
  labels: string[];
  address?: WalletAddress;
  mitigationOf?: ReportId;
  isMitigated?: boolean;
}

export interface FindingDeleteRequest {
  attributedTo: Username;
  risk: string;
  emailAddresses: string[];
}
