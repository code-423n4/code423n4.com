import fs, { readFileSync } from "fs";
import { BotData } from "../../types/user";
import { isDangerousHandle } from "../util/validation-utils";

// find first bot where the given user is on the crew
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
    const botsFiles = fs.readdirSync("./_data/bots");
    for (const file of botsFiles) {
      if (file.endsWith(".json")) {
        const botFile = readFileSync(`./_data/bots/${file}`);
        const bot: BotData = JSON.parse(botFile.toString());
        if (bot?.crew?.includes(userHandle)) {
          if (bot.image) {
            const imagePath = bot.image.slice(2);
            bot.imageUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/bots/${imagePath}`;
          }
          return {
            statusCode: 200,
            body: JSON.stringify(bot),
          };
        }
      }
    }
    return {
      statusCode: 204,
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Team not found" }),
    };
  }
};
