import fetch from "node-fetch";

/**
 * @typedef {import('../../types/contest').Contest} Contest
 */

/**
 * @async
 * @returns {Promise<[Contest]>}
 * @throws Various errors if data cannot be fetched or processed.
 */
const getApiContestData = async () => {
  const res = await fetch(`${process.env.C4_API_URL}/api/v0/getContest`, {
    method: "POST",
    body: JSON.stringify({ token: process.env.C4_API_TOKEN }),
  });
  if (res.status !== 200) {
    console.log(await res.text());
    throw Error("Bad response from API server");
  }
  return await res.json();
};

export { getApiContestData };
