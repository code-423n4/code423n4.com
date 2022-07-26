import { readFileSync } from "fs";
import fetch from "node-fetch";

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

export async function getUserTeams(username) {
  let teamHandles = [];

  const teamUrl = `${process.env.URL}/.netlify/functions/get-team?id=${username}`;
  const teams = await fetch(teamUrl);

  if (teams.status === 200) {
    const teamsData = await teams.json();
    teamHandles = teamsData.map((team) => team.handle);
  }

  return teamHandles;
}
