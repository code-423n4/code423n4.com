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
  active
  start_time
  end_time
  wardens {
    ...PersonDetails
  }
  judges {
    ...PersonDetails
  }
}
`;

export default CONTEST;
