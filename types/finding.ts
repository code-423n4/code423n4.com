export interface Finding {
  title: string;
  body: string;
  labels: {
    name: string;
    color: string;
  }[];
  risk: string;
  state: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  issueNumber: number;
  handle: string;
}

export interface FindingEditRequest {
  issue: number;
  contest: number;
  emailAddresses: string[];
  attributedTo: {
    newValue: string;
    oldValue: string;
    address: string;
  };
  risk: {
    newValue: string;
    oldValue: string;
  };
  title?: string;
  body?: string;
}

export interface FindingsResponse {
  user: Finding[];
  teams: Record<string, Finding[]>;
}

export interface FindingCreateRequest {
  user: string;
  contest: string;
  sponsor: string;
  repo: string;
  emailAddresses: string[];
  attributedTo: string;
  address: string;
  risk: string;
  title: string;
  body: string;
  labels: string[];
}

export interface FindingDeleteRequest {
  attributedTo: string;
  risk: string;
  emailAddresses: string[];
}
