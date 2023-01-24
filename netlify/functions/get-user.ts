import { findUser, getUsers } from "../util/user-utils";

exports.handler = async (event) => {
  // only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed",
      headers: { Allow: "GET" },
    };
  }

  const userHandle = event.queryStringParameters.id;
  try {
    let res;
    if (userHandle === undefined) {
      res = getUsers();
    } else {
      res = await findUser(userHandle);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "User not found" }),
    };
  }
};
