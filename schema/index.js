import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import FindingsJson from "./FindingsJson";
import MarkdownRemark from "./MarkdownRemark";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsCsv}
${FindingsJson}
${MarkdownRemark}
`;
export default SchemaCustomization;
