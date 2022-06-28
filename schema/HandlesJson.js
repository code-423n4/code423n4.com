const HandlesJson = `
type HandlesJson implements Node {
  handle:            String
  link:              String
  moralisId:         String
  """ TODO: add @dontInfer
  image:          ?
  """
  showOnLeaderboard: Boolean

  findings:          [FindingsCsv] @link(by: "handle.handle", from: "handle")
  members:           [HandlesJson] @link(by: "handle", from: "members")
}`;

export default HandlesJson;
