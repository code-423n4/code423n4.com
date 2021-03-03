import ORG from "./ORG"
import PERSON from "./PERSON"
import CONTEST from "./CONTEST"
import FINDING from "./FINDING"
import ORGS from "./ORGS"
import PEOPLE from "./PEOPLE"
import CONTESTS from "./CONTESTS"
import FINDINGS from "./FINDINGS"

const GqlQueries = `
  ${ORG}
  ${PERSON}
  ${CONTEST}
  ${FINDING}
  {
    ${ORGS}
    ${PEOPLE}
    ${CONTESTS}
    ${FINDINGS}
  }
`

export default GqlQueries
