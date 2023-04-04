// use inside sort() like this: `.sort(sortByContestStart("reverse"))`
// leave the orderBy property blank if you'd like them in ascending order (oldest first), as that is the default
const sortByContestStart = (orderBy) => (a, b) => {
  let contestA = new Date(b.node.start_time).getTime();
  let contestB = new Date(a.node.start_time).getTime();

  // TODO: make this work with all types of arrays thrown at it. Below works for reports page.
  // let contestA = new Date(b.node.frontmatter.contest.start_time).getTime();
  // let contestB = new Date(a.node.frontmatter.contest.start_time).getTime();

  let sorted = contestA < contestB ? 1 : contestA > contestB ? -1 : 0;
  return orderBy === "reverse" ? sorted * -1 : sorted;
};

export { sortByContestStart };
