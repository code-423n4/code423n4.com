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

  function isDangerousHandle(s) {
    return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
  }

  const userHandle = event.queryStringParameters.id;

  if (isDangerousHandle(userHandle)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
      }),
    };
  }

  try {
    const userFile = readFileSync(`./_data/handles/${userHandle}.json`);
    const user = JSON.parse(userFile.toString());
    if (user.image) {
      const imagePath = user.image.slice(2);
      user.image = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
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
