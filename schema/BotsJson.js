const BotsJson = `
type BotsJson implements Node @dontInfer {
  handle:            String!
  """ TODO: add @dontInfer
  image:          ?
  """
  showOnLeaderboard: Boolean

  maintainers:       [HandlesJson] @link(by: "handle", from: "maintainers")
}`;

export default BotsJson;
