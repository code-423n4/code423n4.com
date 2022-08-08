import Moralis from "moralis/node";
import fetch from "node-fetch";

const {
  moralisAppId,
  moralisServerUrl,
} = require("../_config");


async function checkAuth(event) {
  const authorization = event.headers["x-authorization"];
  const sessionToken = authorization.split("Bearer ")[1];
  const user = event.headers["c4-user"];

  if (!authorization) {
    return false;
  }

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
  const confirmed = await Moralis.Cloud.run("confirmUser", {
    sessionToken,
    moralisId,
    username: user,
  });
  if (!confirmed) {
    return false;
  }

  return true;
}

export {
  checkAuth,
};
