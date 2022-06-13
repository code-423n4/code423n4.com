require("dotenv").config();

let prefix = "";

switch (process.env.C4_ENV) {
  case "production":
    prefix = "PRODUCTION_";
    break;

  case "staging":
    prefix = "STAGING_";
    break;

  default:
    break;
}
// @todo: figure out how to make sure these functions use the right env variables
// const environment = process.env.NODE_ENV;
// const isStaging = process.env.GATSBY_STAGING;
// let moralisServerUrl;
// let moralisAppId;

// if (isStaging) {
//   moralisServerUrl = process.env.GATSBY_STAGING_MORALIS_SERVER;
//   moralisAppId = process.env.GATSBY_STAGING_MORALIS_APP_ID;
// } else if (environment === "production") {
//   moralisServerUrl = process.env.GATSBY_PRODUCTION_MORALIS_SERVER;
//   moralisAppId = process.env.GATSBY_PRODUCTION_MORALIS_APP_ID;
// } else {
//   moralisServerUrl = process.env.GATSBY_DEV_MORALIS_SERVER;
//   moralisAppId = process.env.GATSBY_DEV_MORALIS_APP_ID;
// }

module.exports = {
  token: process.env[`${prefix}GITHUB_TOKEN`],
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  moralisServerUrl: process.env.GATSBY_MORALIS_SERVER,
  moralisAppId: process.env.GATSBY_MORALIS_APP_ID,
  kickboxApiKey: process.env.KICKBOX_API_KEY,
};
