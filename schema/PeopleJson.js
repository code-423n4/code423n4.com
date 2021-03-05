const PeopleJson = `
type PeopleJson implements Node {
  id:             String
  name:           String
  link:           String
  image:          String
  contests:       [ ContestsJson ] @link(by: "id", from: "contests")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
}`;

export default PeopleJson;
