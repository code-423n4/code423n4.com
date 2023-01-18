import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import ContestsCsvFields from "./ContestsCsvFields";
import MarkdownRemark from "./MarkdownRemark";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsCsv}
${ContestsCsvFields}
${MarkdownRemark}
`;
export default SchemaCustomization;
