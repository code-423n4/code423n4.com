const ReportsJson = `
  type ReportsJson implements Node {
    circa: Frontmatter
  }
  type Frontmatter {
    date:         Date
    title:        String
    slug:         String
    url:          String
    altUrl:       String
    title:        String
    findings:     String
    date:         Date
    sponsor:      OrgsJson @link(by: "name", from: "sponsor")
    contest:      ContestsCsv @link(by: "contestid", from: "contest")
    hide:         Boolean
  }
`;

export default ReportsJson;
