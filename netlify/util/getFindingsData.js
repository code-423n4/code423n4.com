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
  const data = [];
  for (const splitPart of ["first", "second"]) {
    const res = await fetch(
      `${process.env.C4_API_URL}/api/v0/getFindings?splitPart=${splitPart}`,
      {
        method: "POST",
        body: JSON.stringify({ token: process.env.C4_API_TOKEN }),
      }
    );
    if (res.status !== 200) {
      throw Error(
        `Bad ${splitPart} response from API server: ${await res.text()}`
      );
    }
    const partialData = await res.json();
    data.push(...partialData);
  }
  return data;
};

export { getApiFindingsData };
