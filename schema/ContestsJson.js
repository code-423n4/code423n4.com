const ContestsJson = `
type ContestsJson implements Node {
  sponsors:       [ OrgsJson ] @link(by: "id", from: "sponsors")
  details:        String
  active:         Boolean  
  start_time:     Date
  end_time:       Date  
  wardens:        [ PeopleJson ] @link(by: "id", from: "people")
  judges:         [ PeopleJson ] @link(by: "id", from: "people")
  awards:         [ AwardsJson ] @link(by: "id", from: "awards")
}`

export default ContestsJson
