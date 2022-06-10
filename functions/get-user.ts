import { readFileSync } from "fs";

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
    const userFile = readFileSync(`./_data/handles/${userHandle}.json`);
    const user = JSON.parse(userFile.toString());
    if (user.image) {
      const imagePath = user.image.slice(2);
      user.image = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/code423n4.com/main/_data/handles/${imagePath}`;
    }

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
