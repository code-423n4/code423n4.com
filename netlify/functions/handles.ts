import fs, { readFileSync, readdirSync } from "fs";

//need to set up the members portion of the handles data (i think the members field is for teams)
//so my plan is to add a call to get the teams data here
const getHandles = () => {
  const allHandles: {
    handle: string;
    link: string;
    moralisId: string;
    image: string;
    members: string[];
  }[] = [];
  const data = readdirSync(`./_data/handles`);
  data.forEach((file) => {
    if (file.endsWith(".json")) {
      const buffer = readFileSync(`./_data/handles/${file}`);
      const wardenFileData = JSON.parse(buffer.toString());
      if (wardenFileData.image) {
        const imagePath = wardenFileData.image.slice(2);
        wardenFileData.imageUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
      }
      allHandles.push({ ...wardenFileData });
    }
  });

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
