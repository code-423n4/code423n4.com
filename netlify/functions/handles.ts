import fs, { readFileSync, readdirSync } from "fs";

const readAndParseJSONFile = (filePath: string) => {
  const buffer = readFileSync(filePath);
  return JSON.parse(buffer.toString());
};

const getImageUrl = (fileData: any) => {
  if (fileData.image) {
    const imagePath = fileData.image.slice(2);
    return `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
  }
  return null;
};

const getHandles = () => {
  const allHandles: {
    handle: string;
    link: string;
    moralisId: string;
    imageUrl: string;
    members: string[];
  }[] = [];

  const files = readdirSync(`./_data/handles`);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const fileData = readAndParseJSONFile(`./_data/handles/${file}`);
      const imageUrl = getImageUrl(fileData);
      allHandles.push({ ...fileData, imageUrl });
    }
  }
  return allHandles;
};

exports.handler = async (event) => {
  // only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed",
      headers: { Allow: "GET" },
    };
  }

  try {
    // handle
    const allHandles = getHandles();
    return {
      statusCode: 200,
      body: JSON.stringify(allHandles),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString(), details: error.stack }),
    };
  }
};
