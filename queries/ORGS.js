const ORGS = `
people: allOrgsJson {
  edges {
    node {
      ...OrgDetails
    }
  }
}
`;

export default ORGS;
