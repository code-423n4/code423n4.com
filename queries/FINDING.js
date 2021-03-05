const FINDING = `
fragment FindingDetails on OrgsJson {
  id
  title
  description
  type
  severity
  award
  contest {
    ...ContestDetails
  }
  wardens {
    ...PersonDetails
  }
}
`;

export default FINDING;
