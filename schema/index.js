import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import FindingsCsv from "./FindingsCsv";
import MarkdownRemark from "./MarkdownRemark";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsCsv}
${FindingsCsv}
${MarkdownRemark}
`;
export default SchemaCustomization;
