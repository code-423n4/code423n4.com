const CONTESTS = `
people: allContestsJson {
  edges {
    node {
      ...ContestDetails
    }
  }
}
`

export default CONTESTS
