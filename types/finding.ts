export interface Finding {
  title: string;
  body: string;
  labels: Label[];
  risk: string;
  state: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  issueNumber: number;
  handle: string;
  isMitigated?: boolean;
  mitigationOf?: string;
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
    newValue: string;
    oldValue: string;
    // @todo: remove this once all teams have a saved polygon address
    address?: string;
  };
  risk: {
    newValue: string;
    oldValue: string;
  };
  title?: string;
  body?: string;
  mitigationOf?: {
    newValue: string;
    oldValue: string;
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

export interface FindingCreateRequest {
  user: string;
  contest: string;
  sponsor: string;
  repo: string;
  emailAddresses: string[];
  attributedTo: string;
  risk: string;
  title: string;
  body: string;
  labels: string[];
  address?: string;
  mitigationOf?: string;
  isMitigated?: boolean;
}

export interface FindingDeleteRequest {
  attributedTo: string;
  risk: string;
  emailAddresses: string[];
}

export interface OctokitIssuePaginationResponse {
  title: string;
  number: number;
  labels: Label[];
  state: "open" | "closed";
  body: string;
  created_at: string;
  updated_at: string;
}
