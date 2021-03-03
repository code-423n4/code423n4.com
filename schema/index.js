import PeopleJson from "./PeopleJson"
import OrgsJson from "./OrgsJson"
import ContestsJson from "./ContestsJson"
import FindingsJson from "./FindingsJson"

const SchemaCustomization = `
${PeopleJson}
${OrgsJson}
${ContestsJson}
${FindingsJson}
`
export default SchemaCustomization
