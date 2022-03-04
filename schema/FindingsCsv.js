const FindingsCsv = `
type FindingsCsv implements Node @dontInfer {
  contest:       ContestsCsv @link(by: "contestid", from: "contest")
  handle:        HandlesJson @link(by: "handle", from: "handle")
  finding:       String
  risk:          String
  pie:           Float
  split:         Int
  slice:         Float
  award:         Float
  awardCoin:     String
  awardUSD:      Float
}`;

export default FindingsCsv;
