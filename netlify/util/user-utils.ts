import { readFileSync } from "fs";
import Moralis from "moralis-v1/node";
import fetch from "node-fetch";
import uniq from "lodash/uniq";
const { Octokit } = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

import { TeamData, UserData, UserFileData } from "../../types/user";

const {
  token,
  apiKey,
  domain,
  moralisAppId,
  moralisServerUrl,
} = require("../_config");

import { isDangerousHandle } from "./validation-utils";

const OctokitClient = Octokit.plugin(createPullRequest);
const octokit = new OctokitClient({ auth: token });

export async function findUser(userHandle) {
  if (isDangerousHandle(userHandle)) {
    throw "Handle can only contain alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).";
  }

  try {
    const userFile: UserFileData = JSON.parse(
      readFileSync(`./_data/handles/${userHandle}.json`).toString()
    );
    const user: UserData | TeamData = { ...userFile };
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

export async function updateTeamAddresses(
  username: string,
  team: TeamData,
  addresses: {
    chain: string;
    address: string;
  }[]
): Promise<void> {
  const teamData: TeamData = {
    ...team,
    paymentAddresses: addresses,
  };
  const updatedTeamData = JSON.stringify(teamData, null, 2);
  const teamName = team.handle;
  const files = {
    [`_data/handles/${teamName}.json`]: updatedTeamData,
  };
  const owner = process.env.GITHUB_REPO_OWNER;
  const body = `This auto-generated PR updates payment addresses for team ${teamName}. (request made by ${username})`;
  const title = `Update payment addresses for team ${teamName}`;
  const res = await octokit.createPullRequest({
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
  const teamEmails = await getTeamEmails(team);
  const emailSubject = `Payment addresses updated for ${team.handle}`;
  const emailBody = `This update was made by ${username}. You can see the pull request here: ${res.data.html_url}.`;
  await sendConfirmationEmail(teamEmails, emailSubject, emailBody);
}

export async function getTeamEmails(team: TeamData): Promise<string[]> {
  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
    masterKey: process.env.MORALIS_MASTER_KEY,
  });

  const { members } = team;
  const emails = members.map(async (member) => {
    const query = new Moralis.Query("_User");
    query.equalTo("username", member);
    query.select("email");
    const results = await query.find({ useMasterKey: true });
    if (results.length === 0) {
      return "";
    }
    const email = results[0].attributes.email;
    return email || "";
  });

  return Promise.all(emails);
}

export async function sendConfirmationEmail(
  emailAddresses: string[],
  subject: string,
  body: string
) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: apiKey });

  const recipients = `${uniq(emailAddresses).join(", ")}, ${
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
