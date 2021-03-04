const FINDING = `
fragment FindingDetails on OrgsJson {
  contest {
    ...ContestDetails
  }
  id
  recipient {
    ...PersonDetails
  }
  type
  award
}
`;

export default FINDING;
