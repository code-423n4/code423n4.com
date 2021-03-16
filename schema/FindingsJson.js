const FindingsJson = `
type FindingsJson implements Node {
  contest:       ContestsJson @link(by: "contestid", from: "contest")
  handle:        PeopleJson @link(by: "handle", from: "handle")
  risk:          String
  award:         Float
}`;

export default FindingsJson;
