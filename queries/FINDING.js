const FINDING = `
fragment FindingDetails on OrgsJson {
  id
  risk
  award
  contest {
    ...ContestDetails
  }
  handle {
    ...PersonDetails
  }
}
`;

export default FINDING;
