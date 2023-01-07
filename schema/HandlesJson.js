const HandlesJson = `
type HandlesJson implements Node {
  handle:            String
  link:              String
  moralisId:         String
  """ TODO: add @dontInfer
  image:          ?
  """
  showOnLeaderboard: Boolean

  members:           [HandlesJson] @link(by: "handle", from: "members")
}`;

export default HandlesJson;
