const { Client } = require("@notionhq/client");
const { notionToken, notionDb } = require("./_config");
const notion = new Client({ auth: notionToken });

(async () => {
  const pages = []
  let cursor = undefined
  while (true) {
    const { results, next_cursor } = await notion.databases.query({
      database_id: notionDb,
      start_cursor: cursor,
    })
    pages.push(...results)
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  console.log(`${pages.length} results successfully fetched.`)
  const tempResponse =  pages.map(page => {
    if (page.properties.Status.select?.name === "Lost deal" || page.properties.Status.select?.name === "Possible") {
      return null;
    } else {
      return {
        contestId: page.properties.ContestID.number || null,
        status: page.properties.Status.select?.name || null,
      }
    }
  }).filter(el => el !== null);
  console.log(tempResponse, tempResponse.length)


  function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  console.log(sortByKey(tempResponse, "contestId"));

})();