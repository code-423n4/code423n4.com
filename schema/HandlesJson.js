const HandlesJson = `
type HandlesJson implements Node {
  name:           String
  handle:         String
  link:           String
  image:          File
  contests:       [ ContestsJson ] @link(by: "id", from: "contests")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
  members:        [ HandlesJson ] @link(by: "handle", from: "members")
}`;

export default HandlesJson;
