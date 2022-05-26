require("dotenv").config();

module.exports = {
  token: process.env.GITHUB_TOKEN,
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  notionToken: process.env.INTEGRATION_TOKEN,
  notionDb: process.env.DATABASE_ID,
};
