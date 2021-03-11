const FindingsJson = `
type FindingsJson implements Node {
  id:            String
  contest:       ContestsJson @link(by: "id", from: "contest")
  recipient:     [ PeopleJson ] @link(by: "name", from: "people")
  title:         String
  description:   String
  severity:      String
  type:          String
  award:         Int
}`;

export default FindingsJson;
