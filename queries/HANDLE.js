const HANDLE = `
fragment HandleDetails on HandlesJson {
  fields {
    slug
    award_total
    award_per_contest
    findings_total
    findings_per_contest
    contests
    findings
  }
  name
  link
  image
  members
}
`;

export default HANDLE;
