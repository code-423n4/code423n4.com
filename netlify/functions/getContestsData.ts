import fetch from "node-fetch";

exports.handler = async (event) => {
  // only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed",
      headers: { Allow: "GET" },
    };
  }
  try {
    const res = await fetch(`${process.env.C4_API_URL}/api/v0/getContest`, {
      method: "GET",
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};
