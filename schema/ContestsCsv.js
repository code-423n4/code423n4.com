const ContestsCsv = `
type ContestsCsv implements Node @dontInfer {
  contestid:      Int
  title:          String
  details:        String
  sponsor:        OrgsJson @link(by: "name", from: "sponsor")
  start_time:     Date @dateformat
  end_time:       Date @dateformat
  amount:         String
  repo:           String
  findingsRepo:   String
  hide:           Boolean
  league:         String

  fields:         ContestsCsvFields
}`;

export default ContestsCsv;
