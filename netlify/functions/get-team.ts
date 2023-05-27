import fs, { readFileSync } from "fs";
import { TeamData } from "../../types/user";
import { isDangerousHandle } from "../util/validation-utils";

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

  if (isDangerousHandle(userHandle)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Username can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
      }),
    };
  }

  try {
    const usersFiles = fs.readdirSync("./_data/handles");
    const teams: TeamData[] = [];
    usersFiles.forEach((file) => {
      if (file.endsWith(".json")) {
        const wardenFile = readFileSync(`./_data/handles/${file}`);
        const warden = JSON.parse(wardenFile.toString());
        if (warden && warden.members && warden.members.includes(userHandle)) {
          if (warden.image) {
            const imagePath = warden.image.slice(2);
            warden.imageUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
          }
          teams.push({ ...warden });
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
