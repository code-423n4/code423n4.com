// A script to validate data.
// Run with `yarn validate`.
const { readFile, stat } = require("fs/promises");
const path = require("path");
const glob = require("tiny-glob");

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
      "Handle validation failed. See above log for more information"
    );
  }
}

(async () => {
  try {
    await validateHandles();
    console.log("Validation passed!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
