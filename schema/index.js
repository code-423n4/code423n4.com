import HandlesJson from "./HandlesJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import ContestsCsvFields from "./ContestsCsvFields";
import ReportsJson from "./ReportsJson";

const SchemaCustomization = `
${HandlesJson}
${OrgsJson}
${ContestsCsv}
${ContestsCsvFields}
${ReportsJson}
`;
export default SchemaCustomization;
