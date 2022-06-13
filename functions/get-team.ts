import { readFileSync } from "fs";
import path from "path";
import fs from "fs";

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
    let file = fs.readdirSync(handleDir);
    let teams = [];
    file.forEach((handle) => {
      if (handle.includes(".json")) {
        const wardenFile = readFileSync(`./_data/handles/${handle}`);
        const warden = JSON.parse(wardenFile.toString());
        if (warden.image) {
          const imagePath = warden.image.slice(2);
          warden.image = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
        }
        if (warden && warden.members && warden.members.includes(userHandle)) {
          teams.push({ ...warden, username: warden.handle });
        }
      }
    });
    if (teams.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(teams),
      };
    } else {
      return {
        statusCode: 204,
      };
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Team not found" }),
    };
  }
};
