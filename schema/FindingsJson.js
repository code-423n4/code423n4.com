const FindingsJson = `
type FindingsJson implements Node {
  id:            String
  contest:       ContestJson @link(by: "id", from: "contest")
  recipient:     [ PeopleJson ] @link(by: "id", from: "people")
  title:         String
  description:   String
  severity:      String
  type:          String
  award:         Int
}`;

export default FindingsJson;
