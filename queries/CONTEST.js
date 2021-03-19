const CONTEST = `
fragment ContestDetails on ContestsJson {
  fields {
    slug
    awards
  }
  sponsor {
    ...OrgDetails
  }
  id
  title
  details
  start_time
  end_time
  wardens {
    ...HandleDetails
  }
  judges {
    ...HandleDetails
  }
  hide
}
`;

export default CONTEST;
