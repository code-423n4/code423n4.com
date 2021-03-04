const PERSON = `
fragment PersonDetails on PeopleJson {
  fields {
    slug
    award_total
    award_per_contest
    findings_total
    findings_per_contest
  }
  id
  name
  link
  image
  contests {
  }
  findings {
  }
}
`;

export default PERSON;
