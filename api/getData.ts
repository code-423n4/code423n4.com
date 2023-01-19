import fetch from 'node-fetch';
// import { Contest } from '../types/contest'

export const getApiContestData = async () => {

    // let data : Contest[] = [];
    let data;
    console.log(process.env.C4_API_URL);
    console.log(process.env.C4_API_TOKEN)
    const response = await fetch(`${process.env.C4_API_URL}/api/v0/getContest`, {
        method: "POST",
        body: JSON.stringify({
          token: process.env.C4_API_TOKEN
        })
    })
    .then((res) => res.json())
    .then((body) => {
        data = body;
    })
    .catch((err) => console.log(err))

return data;
}