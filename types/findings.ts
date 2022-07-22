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
  linksToCode: string[];
}

export interface FindingsResponse {
  user: Finding[];
  teams: Record<string, Finding[]>;
}
