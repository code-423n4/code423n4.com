const ContestsJson = `
type ContestsJson implements Node {
  contestid:      Int
  sponsor:        OrgsJson @link(by: "name", from: "sponsor")
  title:          String
  amount:         String
  details:        String
  repo:           String
  start_time:     Date
  end_time:       Date  
  wardens:        [ HandlesJson ] @link(by: "name", from: "people")
  judges:         [ HandlesJson ] @link(by: "name", from: "people")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
  hide:           Boolean
}`;

export default ContestsJson;
