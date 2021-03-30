import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsJson from "./ContestsJson";
import FindingsJson from "./FindingsJson";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsJson}
${FindingsJson}
`;
export default SchemaCustomization;
