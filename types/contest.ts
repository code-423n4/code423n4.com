// all values are strings because the source is a CSV file -- changed getting values from api instread of contest.csv
export interface Contest {
  contestid: number;
  title: string;
  sponsor: string;
  details: string;
  start_time: string;
  end_time: string;
  amount: string;
  repo: string;
  findingsRepo: string;
  hide: boolean;
  league: string;
  fields: {
    // contestType: "Audit" | "Mitigation Review"
    submissionPath: string;
    contestPath: string;
    artPath: string;
    status: string;
  };
}
