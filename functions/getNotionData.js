const { Client } = require("@notionhq/client");
const { notionToken, notionDb } = require("./_config");
const notion = new Client({ auth: notionToken });

exports.handler = async () => {
  try {
    const pages = [];
    let cursor = undefined;
    while (true) {
      const { results, next_cursor } = await notion.databases.query({
        database_id: notionDb,
        start_cursor: cursor,
      });
      pages.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }

    const tempResponse = pages
      .map((page) => {
        // !! Problem
        // 15 Gro Protocol ??
        // 33 PoolTogether ??
        // 46 Silo Finance ??
        if (
          page.properties.Status.select?.name === "Lost deal" ||
          page.properties.Status.select?.name === "Possible" ||
          !page.properties.Status.select?.name ||
          !page.properties.ContestID?.number ||
          !page.properties.Dates.date.start ||
          !page.properties.Dates.date.end
        ) {
          return null;
        } else {
          return {
            contestId: page.properties.ContestID.number || null,
            status: page.properties.Status.select?.name || null,
            start_time: page.properties.Dates.date.start || null,
            end_time: page.properties.Dates.date.end || null,
          };
        }
      })
      .filter((el) => el !== null);

    function sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
    return {
      statusCode: 201,
      body: JSON.stringify(sortByKey(tempResponse)),
    };
  } catch (err) {
    console.log(err);
  }
};
