import { DateString, RelativeURL } from "./shared";

// all values are strings because the source is a CSV file -- changed getting values from api instread of contest.csv
export interface DBContest {
  contestid: number;
  title: string;
  sponsor: string;
  details: string;
  start_time: DateString;
  end_time: DateString;
  amount: string;
  repo: RelativeURL;
  findingsRepo: RelativeURL;
  hide: boolean;
  league: string;
}
//seperated thes two here so that I can reuse the above data without having copy a the above to create a new type.
export interface Contest extends DBContest {
  fields: {
    // contestType: "Audit" | "Mitigation Review"
    submissionPath: RelativeURL;
    contestPath: RelativeURL;
    artPath: RelativeURL;
    status: string; // @todo create enum for this
  };
}
