const FindingsJson = `
type FindingsJson implements Node {
  contest:       ContestsCsv @link(by: "contestid", from: "contest")
  handle:        HandlesJson @link(by: "handle", from: "handle")
  risk:          String
  split:         Int
  award:         Float
  awardUSD:      Float
}`;

export default FindingsJson;
