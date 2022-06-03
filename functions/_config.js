require("dotenv").config();

const environment = process.env.NODE_ENV;
const isStaging = process.env.GATSBY_STAGING;
let moralisServerUrl;
let moralisAppId;

if (isStaging) {
  moralisServerUrl = process.env.GATSBY_STAGING_MORALIS_SERVER;
  moralisAppId = process.env.GATSBY_STAGING_MORALIS_APP_ID;
} else if (environment === "production") {
  moralisServerUrl = process.env.GATSBY_PRODUCTION_MORALIS_SERVER;
  moralisAppId = process.env.GATSBY_PRODUCTION_MORALIS_APP_ID;
} else {
  moralisServerUrl = process.env.GATSBY_DEV_MORALIS_SERVER;
  moralisAppId = process.env.GATSBY_DEV_MORALIS_APP_ID;
}

module.exports = {
  token: process.env.GITHUB_TOKEN,
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  moralisServerUrl,
  moralisAppId,
};
