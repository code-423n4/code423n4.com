import Moralis from "moralis-v1/node";
import fetch from "node-fetch";
import { Event } from "@netlify/functions/src/function/event";
import { BotData } from "../../types/user";

const { moralisAppId, moralisServerUrl } = require("../_config");

async function checkAuth(event: Event) {
  const authorization = event.headers["x-authorization"];
  const user = event.headers["c4-user"];
  if (!authorization || !user) {
    return false;
  }
  const sessionToken = authorization.split("Bearer ")[1];

  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
  });

  const userUrl = `${process.env.URL}/.netlify/functions/get-user?id=${user}`;
  const userResponse = await fetch(userUrl);
  if (!userResponse.ok) {
    return false;
  }

  const userData = await userResponse.json();
  if (!userData || !userData.moralisId) {
    return false;
  }

  const { moralisId } = userData;
  try {
    const confirmed = await Moralis.Cloud.run("confirmUser", {
      sessionToken,
      moralisId,
      username: user,
    });
    if (!confirmed) {
      return false;
    }
  } catch (error) {
    // @todo: better error handling
    console.log(error);
    return false;
  }

  return true;
}

async function checkTeamAuth(teamName, username) {
  const teamResponse = await fetch(
    `${process.env.URL}/.netlify/functions/get-user?id=${teamName}`
  );
  if (!teamResponse.ok) {
    throw { status: 401, message: "Team does not exist" };
  }
  const team = await teamResponse.json();
  if (!team.members || !team.members.includes(username)) {
    throw {
      status: 401,
      message: `${username} is not a member of team ${teamName}`,
    };
  }
  return team;
}

async function checkBotAuth(botName, username) {
  const botResponse = await fetch(
    `${process.env.URL}/.netlify/functions/get-bot?id=${username}`
  );
  if (botResponse.status !== 200) {
    throw { status: 401, message: "Bot does not exist" };
  }
  const bot: BotData = await botResponse.json();
  if (!bot.crew || !bot.crew.includes(username)) {
    throw {
      status: 401,
      message: `${username} is not a member of the bot crew for ${botName}`,
    };
  }
  return bot;
}

export { checkAuth, checkTeamAuth, checkBotAuth };
