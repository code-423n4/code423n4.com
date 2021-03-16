const ContestsJson = `
type ContestsJson implements Node {
  contestid:      Int
  sponsor:        OrgsJson @link(by: "name", from: "sponsor")
  title:          String
  details:        String
  start_time:     Date
  end_time:       Date  
  wardens:        [ PeopleJson ] @link(by: "name", from: "people")
  judges:         [ PeopleJson ] @link(by: "name", from: "people")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
  hide:           Boolean
}`;

export default ContestsJson;
