const ContestsCsv = `
type ContestsCsv implements Node @dontInfer {
  contestid:      Int
  sponsor:        OrgsJson @link(by: "name", from: "sponsor")
  title:          String
  amount:         String
  details:        String
  repo:           String
  findingsRepo:   String
  start_time:     Date @dateformat
  end_time:       Date @dateformat
  wardens:        [ HandlesJson ] @link(by: "name", from: "people")
  judges:         [ HandlesJson ] @link(by: "name", from: "people")
  findings:       [ FindingsCsv ] @link(by: "id", from: "findings")
  hide:           Boolean
  league:         String
  fields:         ContestsCsvFields
}`;

export default ContestsCsv;
