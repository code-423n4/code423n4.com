const { Client } = require("@notionhq/client");
const { notionToken, notionContestDb } = require("./_config");
const notion = new Client({ auth: notionToken });

exports.handler = async () => {
  try {
    const pages = [];
    let cursor = undefined;
    //cursor is to handle pagination in notion query
    while (true) {
      const { results, next_cursor } = await notion.databases.query({
        database_id: notionContestDb,
        start_cursor: cursor,
        filter: {
          and: [
            {
              property: "ContestID",
              number: {
                is_not_empty: true,
              },
            },
          ],
        },
      });
      pages.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }

    const statusObject = pages.map((page) => {
      if (
        page.properties.Status.select?.name !== "Lost deal" ||
        page.properties.Status.select?.name !== "Possible" ||
        page.properties.Status.select?.name ||
        page.properties.ContestID?.number
      ) {
        return {
          contestId: page.properties.ContestID.number || null,
          status: page.properties.Status.select?.name || null,
        };
      }
    });
    return {
      statusCode: 201,
      body: JSON.stringify(statusObject),
    };
  } catch (err) {
    return {
      statusCode: err.status,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
