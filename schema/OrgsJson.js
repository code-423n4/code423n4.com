const OrgsJson = `
type OrgsJson implements Node {
  name:           String
  link:           String
  """ TODO: add @dontInfer
  image:          ?
  """

  contests:       [ContestsCsv] @link(by: "sponsor.name", from: "name")
}`;

export default OrgsJson;
