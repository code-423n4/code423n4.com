import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import ContestsCsvFields from "./ContestsCsvFields";
import FindingsCsv from "./FindingsCsv";
import MarkdownRemark from "./MarkdownRemark";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsCsv}
${ContestsCsvFields}
${FindingsCsv}
${MarkdownRemark}
`;
export default SchemaCustomization;
