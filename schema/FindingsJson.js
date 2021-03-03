const FindingsJson = `
type FindingsJson implements Node {
  contest:       ContestJson @link(by: "id", from: "contest")
  recipient:     [ PeopleJson ] @link(by: "id", from: "people")
  type:          String
  award:         Int
}`

export default FindingsJson
