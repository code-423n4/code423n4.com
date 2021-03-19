const FINDING = `
fragment FindingDetails on OrgsJson {
  id
  risk
  award
  contest {
    ...ContestDetails
  }
  handle {
    ...HandleDetails
  }
}
`;

export default FINDING;
