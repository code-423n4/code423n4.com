require("dotenv").config();

module.exports = {
  token: process.env.GITHUB_TOKEN,
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  moralisServerUrl: process.env.GATSBY_MORALIS_SERVER,
  moralisAppId: process.env.GATSBY_MORALIS_APP_ID,
  kickboxApiKey: process.env.KICKBOX_API_KEY,
};
