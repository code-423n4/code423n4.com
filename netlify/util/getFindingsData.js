import fetch from "node-fetch";

/**
 * @typedef {import('../../types/finding').AwardFinding} AwardFinding
 */

/**
 * @async
 * This function fetches data from our API and returns a Promise containing
 * an array of AwardFinding objects.
 * @returns {Promise<[AwardFinding]>}
 * @throws Various errors if data cannot be fetched or processed.
 */
const getApiFindingsData = async () => {
  const res = await fetch(`${process.env.C4_API_URL}/api/v0/getFindings`, {
    method: "POST",
    body: JSON.stringify({ token: process.env.C4_API_TOKEN }),
  });
  if (res.status !== 200) {
    throw Error(`Bad response from API server: ${await res.text()}`);
  }

  const smolData = await res.json();
  return smolData.map(
    ({
      c: contest,
      s: score,
      h: handle,
      f: finding,
      r: risk,
      p: pie,
      sp: split,
      sl: slice,
      a: award,
      aw: awardCoin,
      awa: awardUSD,
    }) => ({
      contest,
      score,
      handle,
      finding,
      risk,
      pie,
      split,
      slice,
      award,
      awardCoin,
      awardUSD,
    })
  );
};

export { getApiFindingsData };
