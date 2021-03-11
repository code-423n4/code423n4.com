const ORG = `
fragment OrgDetails on OrgsJson {
  fields {
    slug
  }
  name
  link
  image
  contests {
    ...ContestDetails
  }
  findings {
    ...FindingDetails
  }
}
`;

export default ORG;
