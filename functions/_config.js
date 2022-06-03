require("dotenv").config();

const environment = process.env.NODE_ENV;
const isStaging = process.env.STAGING;
let moralisServerUrl;
let moralisAppId;

if (isStaging) {
  moralisServerUrl = process.env.STAGING_MORALIS_SERVER;
  moralisAppId = process.env.STAGING_MORALIS_APP_ID;
} else if (environment === "production") {
  moralisServerUrl = process.env.PRODUCTION_MORALIS_SERVER;
  moralisAppId = process.env.PRODUCTION_MORALIS_APP_ID;
} else {
  moralisServerUrl = process.env.DEV_MORALIS_SERVER;
  moralisAppId = process.env.DEV_MORALIS_APP_ID;
}

module.exports = {
  token: process.env.GITHUB_TOKEN,
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  moralisServerUrl,
  moralisAppId,
};
