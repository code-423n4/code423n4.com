// this shim just makes gatsby-node-es6.js work with es6 modules
require(`@babel/register`)({
  presets: ["@babel/preset-env", "@babel/preset-react"],
})
module.exports = require(`./gatsby-node-es6.js`)
