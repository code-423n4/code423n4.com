import ORG from "./ORG";
import HANDLE from "./HANDLE";
import CONTEST from "./CONTEST";
import FINDING from "./FINDING";
import ORGS from "./ORGS";
import HANDLES from "./HANDLES";
import CONTESTS from "./CONTESTS";
import FINDINGS from "./FINDINGS";

const GqlQueries = `
  ${ORG}
  ${HANDLE}
  ${CONTEST}
  ${FINDING}
  {
    ${ORGS}
    ${HANDLES}
    ${CONTESTS}
    ${FINDINGS}
  }
`;

export default GqlQueries;
