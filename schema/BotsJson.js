const BotsJson = `
type BotsJson implements Node @dontInfer {
  handle:            String!
  """ TODO: add @dontInfer
  image:          ?
  """
  showOnLeaderboard: Boolean

  crew:       [HandlesJson] @link(by: "handle", from: "crew")
}`;

export default BotsJson;
