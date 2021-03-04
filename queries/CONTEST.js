const CONTEST = `
fragment ContestDetails on ContestsJson {
  fields {
    slug
  }
  sponsor {
    ...OrgDetails
  }
  id
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
  awards {
    ...AwardsDetails
  }
}
`;

export default CONTEST;
