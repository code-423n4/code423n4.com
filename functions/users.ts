import { readFileSync } from "fs";
import { isDangerous } from "./_utils";

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

  if (isDangerous(userHandle)) {
    return {
      statusCode: 400,
      body:
        "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
    };
  }

  try {
    const userFile = readFileSync(`./_data/handles/${userHandle}.json`);

    const user = JSON.parse(userFile.toString());
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "User not found" }),
    };
  }
};
