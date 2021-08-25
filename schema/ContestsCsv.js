const ContestsCsv = `
type ContestsCsv implements Node {
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
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
  hide:           Boolean
  league:         String
}`;

export default ContestsCsv;
