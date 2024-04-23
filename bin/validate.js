const { readFile } = require("fs/promises");
const fetch = require("node-fetch");

// validate teams
(async () => {
  const [argv1, argv2, ...changedFiles] = process.argv; // get all changed files
  let passedValidation = true;
  for (const changedFile of changedFiles) {
    // for each changed file, do validation for team files
    if (!changedFile.startsWith("_data/handles")) {
      continue;
    }
    // read and parse the changed file
    const blob = await readFile("./" + changedFile);
    let parsedHandle;
    try {
      parsedHandle = JSON.parse(blob);
    } catch (err) {
      console.error(`❌ Unable to parse JSON file at ${changedFile}`);
      passedValidation = false;
      continue;
    }
    // check that the required handle field exists
    const teamHandle = parsedHandle.handle;
    if (!teamHandle) {
      console.error("❌ Handle field must exist.");
      passedValidation = false;
      continue;
    }
    // check that the required members field exists
    const teamMembers = parsedHandle.members;
    if (!teamMembers) {
      console.error("❌ Members field must exist.");
      passedValidation = false;
      continue;
    }
    // check that there is at least 1 member
    if (teamMembers.length < 1) {
      console.error("❌ Team must have 1 or more members");
      passedValidation = false;
      continue;
    }
    // give warning if handle exists, in case this is a team creation (as opposed to team edit).
    const res = await fetch(
      `https://api.code4rena.com/api/get-user?id=${teamHandle}`
    ); // fetches either team or user
    if (res.status === 200) {
      console.info(
        `❗ Handle ${teamHandle} is taken. Ignore if editting team.`
      );
    }
    // check that each member in the team exists
    for (const member of parsedHandle.members) {
      const res = await fetch(
        `https://api.code4rena.com/api/get-user?id=${member}`
      );
      if (res.status !== 200) {
        console.error(`❌ Team member ${member} does not exist.`);
        passedValidation = false;
      }
    }
  }
  if (!passedValidation) {
    throw new Error(
      "❌  Team validation failed. See above log for more information."
    );
  }
})();
