const FindingsJson = `
type FindingsJson implements Node {
  contest:       ContestsJson @link(by: "contestid", from: "contest")
  handle:        HandlesJson @link(by: "handle", from: "handle")
  risk:          String
  award:         Float
}`;

export default FindingsJson;
