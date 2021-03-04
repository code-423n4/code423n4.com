const CONTESTS = `
contests: allContestsJson(
  filter: { active: { eq: "true" } }
  sort: { fields: end_time, order: ASC }
) {
  edges {
    node {
      ...ContestDetails
    }
  }
}
`;

export default CONTESTS;
