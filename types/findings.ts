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

export interface FindingsResponse {
  user: Finding[];
  teams: Record<string, Finding[]>;
}

export interface FindingResponse {
  name: string;
  finding: Finding;
}
