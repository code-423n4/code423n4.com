// A script to validate data.
// Run with `yarn validate`.
const { readFile, stat } = require("fs/promises");
const path = require("path");
const glob = require("tiny-glob");

async function getUniqueHandles() {
  const handles = await glob("./_data/handles/*.json");
  const uniqueHandles = new Set();
  for (const handleFile of handles) {
    const blob = await readFile(handleFile);
    let parsedHandle;
    try {
      parsedHandle = JSON.parse(blob);
    } catch (err) {
      console.error(`Unable to parse JSON file at ${handleFile}`);
      continue;
    }

    uniqueHandles.add(parsedHandle.handle);
  }

  return uniqueHandles;
}

// Validate handles.
async function validateHandles() {
  const handles = await glob("./_data/handles/*.json");
  let passedValidation = true;
  for (const handleFile of handles) {
    const blob = await readFile(handleFile);
    let parsedHandle;
    try {
      parsedHandle = JSON.parse(blob);
    } catch (err) {
      console.error(`Unable to parse JSON file at ${handleFile}`);
      passedValidation = false;
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(parsedHandle, "handle")) {
      console.error(`Unable to find key "handle" in ${handleFile}`);
      passedValidation = false;
    }

    if (
      Object.prototype.hasOwnProperty.call(parsedHandle, "image") &&
      parsedHandle.image !== ""
    ) {
      if (!parsedHandle.image.startsWith("./avatars/")) {
        console.error(
          `"image" property must begin with "./avatars" in ${handleFile}. Found ${parsedHandle.image}.`
        );
        passedValidation = false;
      }

      try {
        await stat(
          path.join(path.resolve("./_data/handles"), parsedHandle.image)
        );
      } catch (err) {
        console.error(
          `Unable to read file from "image" key in ${handleFile}. Does "${parsedHandle.image}" exist?`
        );
        passedValidation = false;
      }
    }
  }

  if (!passedValidation) {
    throw new Error(
      "❌  Handle validation failed. See above log for more information."
    );
  }

  console.log("✅  Handle validation passed!");
}

// Validate teams.
async function validateTeams() {
  const uniqueHandles = await getUniqueHandles();
  const handles = await glob("./_data/handles/*.json");
  let passedValidation = true;
  for (const handleFile of handles) {
    const blob = await readFile(handleFile);
    let parsedHandle;
    try {
      parsedHandle = JSON.parse(blob);
    } catch (err) {
      console.error(`Unable to parse JSON file at ${handleFile}`);
      passedValidation = false;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(parsedHandle, "members")) {
      Array.prototype.forEach.call(parsedHandle.members, (member) => {
        if (!uniqueHandles.has(member)) {
          console.error(
            `Team specified in ${handleFile} has unregistered handle: ${member}`
          );
          passedValidation = false;
        }
      });
    }
  }

  if (!passedValidation) {
    throw new Error(
      "❌  Teams validation failed. See above log for more information."
    );
  }

  console.log("✅  Handle validation passed!");
}

async function validateOrganizations() {
  const orgs = await glob("./_data/orgs/*.json");
  let passedValidation = true;
  for (const orgFile of orgs) {
    const blob = await readFile(orgFile);
    let parsedOrg;
    try {
      parsedOrg = JSON.parse(blob);
    } catch (err) {
      console.error(`Unable to parse JSON file at ${orgFile}`);
      passedValidation = false;
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(parsedOrg, "image")) {
      console.error(`Unable to find key "image" in ${orgFile}`);
      passedValidation = false;
      continue;
    }

    try {
      await stat(path.join(path.resolve("./_data/orgs"), parsedOrg.image));
    } catch (err) {
      console.error(
        `Unable to read file from "image" key in ${orgFile}. Does "${parsedOrg.image}" exist?`
      );
      passedValidation = false;
    }
  }

  if (!passedValidation) {
    throw new Error(
      "❌  Organization validation failed. See above log for more information."
    );
  }

  console.log("✅  Organization validation passed!");
}

// async function validateFindings() {
//   let passedValidation = true;
//   let parsedFindings;
//   try {
//     parsedFindings = await getApiFindingsData();
//   } catch (err) {
//     console.error(`Unable to parse JSON file at ${findingsFile}`);
//     passedValidation = false;
//   }

//   const uniqueHandles = await getUniqueHandles();
//   const unknownHandles = new Set();
//   const unknownContestIds = new Set();
//   for (const finding of parsedFindings) {
//     if (!uniqueHandles.has(finding.handle)) {
//       unknownHandles.add(finding.handle);
//       passedValidation = false;
//       continue;
//     }
//   }

//   if (unknownHandles.size > 0) {
//     console.error(`Found ${unknownHandles.size} unknown handles:`);
//     console.log(unknownHandles);
//   }

//   if (unknownContestIds.size > 0) {
//     console.error(`Found ${unknownContestIds.size} unknown contestids:`);
//     console.log(unknownContestIds);
//   }

//   if (!passedValidation) {
//     throw new Error(
//       "❌  Findings validation failed. See above log for more information."
//     );
//   }

//   console.log("✅  Findings validation passed!");
// }

(async () => {
  try {
    await validateHandles();
    await validateTeams();
    await validateOrganizations();
    // await validateFindings();
    console.log("Validation passed!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
