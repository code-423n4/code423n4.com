import HandlesJson from "./HandlesJson";
import BotsJson from "./BotsJson";
import OrgsJson from "./OrgsJson";
import ContestsCsv from "./ContestsCsv";
import ContestsCsvFields from "./ContestsCsvFields";
import ReportsJson from "./ReportsJson";

const SchemaCustomization = `
${HandlesJson}
${BotsJson}
${OrgsJson}
${ContestsCsv}
${ContestsCsvFields}
${ReportsJson}
`;
export default SchemaCustomization;
