const ContestsJson = `
type ContestsJson implements Node {
  id:             String
  sponsors:       [ OrgsJson ] @link(by: "id", from: "sponsors")
  title:          String
  details:        String
  active:         Boolean  
  start_time:     Date
  end_time:       Date  
  wardens:        [ PeopleJson ] @link(by: "id", from: "people")
  judges:         [ PeopleJson ] @link(by: "id", from: "people")
  awards:         [ AwardsJson ] @link(by: "id", from: "awards")
}`;

export default ContestsJson;
