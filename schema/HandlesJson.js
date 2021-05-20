const HandlesJson = `
type HandlesJson implements Node {
  name:           String
  handle:         String
  link:           String
  contests:       [ ContestsCsv ] @link(by: "id", from: "contests")
  findings:       [ FindingsJson ] @link(by: "handle.handle", from: "handle")
  members:        [ HandlesJson ] @link(by: "handle", from: "members")
}`;

export default HandlesJson;
