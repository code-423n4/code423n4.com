const { readFileSync } = require("fs");
const path = require("path");
const fs = require("fs");

exports.handler = async (event) => {
  // only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed",
      headers: { Allow: "GET" },
    };
  }
  const userHandle = event.queryStringParameters.id;

  try {
    const handleDir = path.join(__dirname + "/../_data/handles");
    let data = fs.readdirSync(handleDir);
    const teams = data
      .map((handle) => {
        if (handle.includes(".json")) {
          const warden = readFileSync(`./_data/handles/${handle}`);
          return JSON.parse(warden.toString());
        } else {
          return null;
        }
      })
      .filter((el) => el !== null)
      .filter((el) => el.members !== undefined)
      .filter((el) => el.members.includes(userHandle));

    if (teams.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(teams[0]),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Team not found" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Team not found" }),
    };
  }
};
