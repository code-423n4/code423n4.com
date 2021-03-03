const FINDING = `
fragment FindingDetails on OrgsJson {
  contest {
    ...ContestDetails
  }
  recipient {
    ...PersonDetails
  }
  type
  award
}
`

export default FINDING
