const CONTEST = `
fragment ContestDetails on ContestsJson {
  fields {
    slug
  }
  sponsors {
    ...OrgDetails
  }
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
`

export default CONTEST
