const PeopleJson = `
type PeopleJson implements Node {
  name:           String
  handle:         String
  link:           String
  image:          String
  contests:       [ ContestsJson ] @link(by: "id", from: "contests")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
}`;

export default PeopleJson;
