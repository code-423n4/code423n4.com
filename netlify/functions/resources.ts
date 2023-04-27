import { builder, Handler } from "@netlify/functions";
import { getApiContestData } from "../util/getContestsData";
import { getApiFindingsData } from "../util/getFindingsData";

export function tableToCsv(rows: string[][]): string {
  function escape(str) {
    // see https://tools.ietf.org/html/rfc4180#section-2
    // via https://stackoverflow.com/a/769675/179583
    if (typeof str !== "string") {
      str = str.toString();
    }
    if (str.match(/[,"\n]/)) {
      /* "If double-quotes are used to enclose fields, then a double-quote appearing
          inside a field must be escaped by preceding it with another double quote." */
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
  return rows.map((row) => row.map(escape).join(",")).join("\n") + "\n";
}

const resourcesHandler: Handler = async (event, context) => {
  const [, , resourceFilename, ..._extra] = event.path.split("/");

  if (resourceFilename === "contests.csv") {
    let allContests = await getApiContestData();

    // assume all public for now
    let publicContests = allContests.filter((contests) => !contests.hide);

    let tableData: string[][] = [
      [
        "contestid",
        "title",
        "sponsor",
        "details",
        "start_time",
        "end_time",
        "amount",
        "repo",
        "findingsRepo",
        "hide",
        "league",
      ],

      ...publicContests.map((contest) => {
        return [
          "" + contest.contestid,
          contest.title,
          contest.sponsor,
          contest.details,
          contest.start_time,
          contest.end_time,
          contest.amount,
          contest.repo,
          contest.findingsRepo,
          contest.hide ? "True" : "False",
          contest.league,
        ];
      }),
    ];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv",
      },
      body: tableToCsv(tableData),
    };
  } else if (resourceFilename === "findings.csv") {
    const findingsData = await getApiFindingsData();
    let tableData: string[][] = [
      [
        "contest",
        "handle",
        "finding",
        "risk",
        "score",
        "pie",
        "split",
        "slice",
        "award",
        "awardCoin",
        "awardUSD",
      ],
      //contest,handle,finding,risk,score,pie,split,slice,award,awardCoin,awardUSD
      ...findingsData.map((finding) => {
        return [
          "" + finding.contest,
          finding.handle,
          finding.finding,
          finding.risk,
          finding.score === null ? "" : "" + finding.score,
          "" + finding.pie,
          "" + finding.split,
          "" + finding.slice,
          "" + finding.award,
          finding.awardCoin,
          "" + finding.awardUSD,
        ];
      }),
    ];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv",
      },
      body: tableToCsv(tableData),
    };
  } else {
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }
};

export const handler = builder(resourcesHandler);
