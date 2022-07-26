export interface Finding {
  title: string;
  body: string;
  labels: {
    name: string;
    color: string;
  }[];
  risk: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  issueNumber: number;
}

export interface FindingEditRequest {
  issue: number;
  contest: number;
  emailAddresses?: string[];
  attributedTo?: {
    newValue: string;
    oldValue: string;
    wallet: string;
  };
  risk?: {
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

export interface FindingResponse {
  name: string;
  finding: Finding;
}
