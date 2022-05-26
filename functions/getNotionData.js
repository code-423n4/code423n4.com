const { Client } = require("@notionhq/client");
const { notionToken, notionDb } = require("./_config");
const notion = new Client({ auth: notionToken });

(async () => {
  const response = await notion.databases.query({
    database_id: notionDb,
    page_size: 300
  });
  console.log(response)
  const tempResponse = response.results.map(element => {
    if (!element.properties.ContestID.number) {
      return null;
    }
    return {
      contestId: element.properties.ContestID.number || null,
      status: element.properties.Status.select?.name ||  element.properties.ContestID.number < 80 ? "Completed" : null,
    }
  }).filter(el => el !== null);
  function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  return (sortByKey(tempResponse, "contestId"));

})();