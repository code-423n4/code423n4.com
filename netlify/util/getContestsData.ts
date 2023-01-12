const fetch = require("node-fetch");

const getApiContestData = async () => {
  try {
    const res = await fetch(`http://localhost:8888/api/v0/getContest`, {
      method: "POST",
      body: JSON.stringify({ token: process.env.C4_API_TOKEN }),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getApiContestData };
