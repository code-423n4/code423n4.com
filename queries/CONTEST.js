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
    ...PersonDetails
  }
  judges {
    ...PersonDetails
  }
  hide
}
`;

export default CONTEST;
