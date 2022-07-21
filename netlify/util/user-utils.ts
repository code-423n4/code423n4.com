import { readFileSync } from "fs";
import { isDangerousHandle } from "../util/validation-utils";

export async function findUser(userHandle) {
  if (isDangerousHandle(userHandle)) {
    throw "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).";
  }

  try {
    const userFile = readFileSync(`./_data/handles/${userHandle}.json`);
    const user = JSON.parse(userFile.toString());
    if (user.image) {
      const imagePath = user.image.slice(2);
      user.imageUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.REPO}/${process.env.BRANCH_NAME}/_data/handles/${imagePath}`;
    }

    return user;
  } catch (error) {
    throw "User not found";
  }
}
