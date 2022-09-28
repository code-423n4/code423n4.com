// all values are strings because the source is a CSV file
export interface Contest {
  contestid: string;
  title: string;
  sponsor: string;
  details: string;
  start_time: string;
  end_time: string;
  amount: string;
  repo: string;
  findingsRepo: string;
  hide: "True" | "False";
  league: string;
}
