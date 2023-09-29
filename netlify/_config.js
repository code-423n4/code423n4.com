require("dotenv").config();

const nextBotQualifier = JSON.parse(
  require("fs").readFileSync("_data/bot-race-qualifier.json", "utf8")
);

module.exports = {
  token: process.env.GITHUB_TOKEN,
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  notionToken: process.env.NOTION_CONTEST_INTEGRATION_TOKEN,
  notionContestDb: process.env.NOTION_CONTEST_DATABASE_ID,
  moralisServerUrl: process.env.GATSBY_MORALIS_SERVER,
  moralisAppId: process.env.GATSBY_MORALIS_APP_ID,
  kickboxApiKey: process.env.KICKBOX_API_KEY,
  apiToken: process.env.C4_API_TOKEN,
  nextBotQualifier,
};
