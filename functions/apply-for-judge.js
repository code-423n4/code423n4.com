const { Octokit } = require("@octokit/core");
const { token, apiKey, domain } = require("./_config");

const octokit = new Octokit({ auth: token });
// const mg = require("mailgun-js")({ apiKey, domain });

exports.handler = async (event) => {
  console.log("event", event);
  // only allow POST
  // if (event.httpMethod !== "POST") {
  //   return {
  //     statusCode: 405,
  //     body: "Method not allowed",
  //     headers: { Allow: "POST" },
  //   };
  // }
  const data = JSON.parse(event.body);
  const { handle, title } = data;

  // let handle = "Burgertime";
  // let title = "Tick tock, it's judge o clock";

  // ensure we have the data we need
  if (!handle || !title) {
    return {
      statusCode: 422,
      body: "Handle and title are required.",
    };
  }

  // try {
  //   let createIssue = await octokit.request(
  //     "POST /repos/{owner}/{repo}/issues",
  //     {
  //       owner: "code-423n4",
  //       repo: "judges",
  //       title: `handle: ${handle} | title: ${title} `,
  //     }
  //   );
  // } catch (err) {
  //   console.log(`ERROR:${err}`);
  // }
};
