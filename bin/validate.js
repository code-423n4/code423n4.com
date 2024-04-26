const { readFile } = require("fs/promises");
const fetch = require("node-fetch");

// validate teams
(async () => {
  const [argv1, argv2, ...changedFiles] = process.argv; // get all changed files
  let passedValidation = true;
  for (const changedFile of changedFiles) {
    // for each changed file, do validation for team files
    if (
      !changedFile.startsWith("_data/handles") ||
      changedFile.startsWith("_data/handles/avatars")
    ) {
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
    // check that the required members field exists; warning if not as it may be a warden
    const teamMembers = parsedHandle.members;
    if (!teamMembers) {
      console.info(
        "❗ Members field must exist for teams. Ignore for wardens."
      );
    }
    // give warning if handle exists, in case this is a team creation (as opposed to team edit).
    const userFetches = await Promise.all([
      await fetch(`https://api.code4rena.com/api/get-user?id=${teamHandle}`), // registered users and teams
      await fetch(
        `https://api-v1.code4rena.com/users/nonce?handle=${teamHandle}`
      ), // catches non-verified/archived users not in v0
    ]);
    // if the handle already exists, give a warning (could be team edit)
    if (userFetches[0].status === 200 || userFetches[1].status === 200) {
      console.info(
        `❗ Handle ${teamHandle} is taken. Ignore if editting team.`
      );
    } else {
      // team doesn't exist, so must be a team creation; check that there is at least 1 member
      if (parsedHandle.members && teamMembers.length < 1) {
        // if members exist it must be a team
        console.error(
          "❗Teams should have 1 or more members. Ignore if for warden."
        );
        passedValidation = false;
        continue;
      }
    }
    // check that each member in the team exists
    if (parsedHandle.members) {
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
  }
  if (!passedValidation) {
    throw new Error(
      "❌  Team validation failed. See above log for more information."
    );
  }
})();
