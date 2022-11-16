const ContestsCsvFields = `
type ContestsCsvFields implements Node @dontInfer {
  contestPath: String
  submissionPath: String
  artPath: String
  readmeContent: String
  status: String
  codeAccess: String
}`;

export default ContestsCsvFields;
