const OrgsJson = `
type OrgsJson implements Node {
  name:           String
  link:           String
  description:    String
  contests:       [ ContestsCsv ] @link(by: "sponsor.name", from: "name")
  findings:       [ FindingsCsv ] @link(by: "id", from: "findings")
}`;

export default OrgsJson;
