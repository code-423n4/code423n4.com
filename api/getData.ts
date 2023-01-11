import fetch from "node-fetch";

export const getApiContestData = async () => {
  let data;
  await fetch(`${process.env.C4_API_URL}/api/v0/getContest`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((body) => {
      data = body;
    })
    .catch((err) => console.log(err));

  return data;
};
