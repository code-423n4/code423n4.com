import Moralis from "moralis/node";

const {
  moralisAppId,
  moralisServerUrl,
} = require("../_config");


async function checkAuth(event) {
  const authorization = event.headers["x-authorization"];

  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  await Moralis.start({
    serverUrl: moralisServerUrl,
    appId: moralisAppId,
  });

  // wip: from submit-finding auth
  //   do we need username? can we check session token?
  // const userUrl = `${event.headers.origin}/.netlify/functions/get-user?id=${user}`;
  // const userResponse = await fetch(userUrl);
  // if (!userResponse.ok) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "You must be registered to submit findings",
  //     }),
  //   };
  // }

  // const userData = await userResponse.json();
  // if (!userData || !userData.moralisId) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "You must be registered to submit findings",
  //     }),
  //   };
  // }

  // const { moralisId } = userData;
  // const sessionToken = authorization.split("Bearer ")[1];
  // const confirmed = await Moralis.Cloud.run("confirmUser", {
  //   sessionToken,
  //   moralisId,
  //   username: user,
  // });
  // if (!confirmed) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: "Authorization failed",
  //     }),
  //   };
  // }
}

export {
  checkAuth,
};
