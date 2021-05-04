import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsJson from "./ContestsJson";
import FindingsJson from "./FindingsJson";
import MarkdownRemark from "./MarkdownRemark";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsJson}
${FindingsJson}
${MarkdownRemark}
`;
export default SchemaCustomization;
