const ContestsJson = `
type ContestsJson implements Node {
  id:             String
  sponsor:        OrgsJson @link(by: "name", from: "sponsor")
  title:          String
  details:        String
  active:         Boolean  
  start_time:     Date
  end_time:       Date  
  wardens:        [ PeopleJson ] @link(by: "name", from: "people")
  judges:         [ PeopleJson ] @link(by: "name", from: "people")
  findings:       [ FindingsJson ] @link(by: "id", from: "findings")
}`;

export default ContestsJson;
