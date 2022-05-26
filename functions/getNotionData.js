const { Client } = require("@notionhq/client");
const { notionToken, notionDb } = require("./_config");
const notion = new Client({ auth: notionToken });

(async () => {

  const response = await notion.databases.query({
    database_id: notionDb,
  });
  console.log(response.results[0].properties);
})();