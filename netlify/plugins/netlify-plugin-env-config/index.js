// https://www.netlify.com/blog/2020/05/21/localize-your-environment-variables-by-context-with-build-plugins/
// https://github.com/cball/netlify-plugin-contextual-env/blob/master/src/index.js

// module.exports = {
//   onPreBuild: () => {
//     console.log("PRE BUILD");
//   },
// }

// const fs = require('fs');
// const util = require('util');

/**
 * Overrides an ENV var with a value if it exists
 * @param {*} key the key to overwrite if found
 * @param {*} contextOrBranch the value to check
 * @param {*} mode the mode to use (prefix or suffix)
 */
function setEnvWithValue(key, contextOrBranch, mode) {
  const envVar = mode === 'prefix' ? `${contextOrBranch}_${key}` : `${key}_${contextOrBranch}`;

  if (!process.env[envVar]) {
    return;
  }

  // console.log(`Exporting ${key}=${process.env[envVar]}.`);
  console.log(`Exporting ${key} <- ${envVar}.`);
  process.env[key] = process.env[envVar];

  return `${key}=${process.env[envVar]}\n`;
}

module.exports = {
  onPreBuild: async ({ inputs }) => {
    const context = `${process.env.CONTEXT}`.toUpperCase().replace(/-/g, '_');
    const branch = `${process.env.BRANCH}`.toUpperCase().replace(/-/g, '_');
    const { mode } = inputs;

    Object.keys(process.env).forEach((key) => {
      console.log(`${key}=${process.env[key]}`);
    });

    const envOverrides = Object.keys(process.env).map((key) => [
      setEnvWithValue(key, context, mode),
      setEnvWithValue(key, branch, mode),
    ]);

    const replaced = [].concat(...envOverrides).filter(Boolean);

    if (replaced.length) {
      console.log(`Replaced ${replaced.length} ENVs`);
    } else {
      console.log(`Nothing found... keeping default ENVs`);
    }
  },
};
