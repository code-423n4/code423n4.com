// // this shim just makes gatsby-node-es6.js work with es6 modules
const requireEsm = require("esm")(module);
module.exports = requireEsm("./gatsby-node.esm.js");
