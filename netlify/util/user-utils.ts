import { readFileSync } from "fs";
import fetch from "node-fetch";
const { Octokit } = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

import { TeamData } from "../../types/user";

const { token, apiKey, domain } = require("../_config");

import { isDangerousHandle } from "../util/validation-utils";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

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

export async function getUserTeams(username: string): Promise<string[]> {
  let teamHandles: string[] = [];

  const teamUrl = `${process.env.URL}/.netlify/functions/get-team?id=${username}`;
  const teams = await fetch(teamUrl);

  if (teams.status === 200) {
    const teamsData: TeamData[] = await teams.json();
    teamHandles = teamsData.map((team) => team.handle);
  }

  return teamHandles;
}

export async function checkAndUpdateTeamAddress(
  attributedTo,
  user,
  newPolygonAddress
): Promise<void> {
  // @todo: break apart check and update
  const isTeamSubmission = attributedTo !== user;
  if (!isTeamSubmission) {
    return;
  }
  const teamUrl = `${process.env.URL}/.netlify/functions/get-user?id=${attributedTo}`;
  const teamResponse = await fetch(teamUrl);
  if (!teamResponse.ok) {
    throw { status: 401, message: "Unauthorized" };
  }
  const team = await teamResponse.json();
  if (!team.members || !team.members.includes(user)) {
    throw {
      status: 401,
      message: "Unauthorized",
    };
  }
  // @todo: delete this once all existing teams have added addresses
  if (!team.address) {
    // create a PR to update team JSON file with team address
    try {
      const teamData: TeamData = {
        handle: team.handle,
        members: team.members,
        link: team.link,
      };
      if (team.image) {
        teamData.image = team.image;
      }
      const updatedTeamData = JSON.stringify(
        {
          ...teamData,
          address: newPolygonAddress,
        },
        null,
        2
      );
      const teamName = team.handle;
      const files = {
        [`_data/handles/${teamName}.json`]: updatedTeamData,
      };
      const owner = process.env.GITHUB_REPO_OWNER;
      const body = `This auto-generated PR adds polygon address for team ${teamName}`;
      const title = `Add address for team ${teamName}`;
      await octokit.createPullRequest({
        owner,
        repo: process.env.REPO,
        title,
        body,
        base: process.env.BRANCH_NAME,
        head: `warden/${teamName}`,
        changes: [
          {
            files,
            commit: title,
          },
        ],
      });
    } catch (error) {
      // don't throw error if this PR fails - there will likely be duplicates
      // due to the fact that PRs take some time to review and merge and we
      // don't want to block teams from submitting findings in the meantime
      console.error(error);
    }
  }
}

export async function sendConfirmationEmail(
  emailAddresses: string[],
  subject: string,
  body: string
) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: apiKey });

  const recipients = `${emailAddresses.join(", ")}, ${
    process.env.EMAIL_SENDER
  }`;

  const emailData = {
    from: process.env.EMAIL_SENDER,
    to: recipients,
    subject,
    text: body,
  };

  return mg.messages.create(domain, emailData);
}
