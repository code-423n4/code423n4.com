import path from "path";
import SchemaCustomization from "./schema";
// import GraphQLQueries from "./queries";

// const _ = require("lodash")
// const remark = require("remark")
// const remarkHTML = require("remark-html")
// const truncate = require("truncate-html")

exports.createSchemaCustomization = (helpers) => {
  const { actions } = helpers;
  const { createTypes } = actions;
  try {
    createTypes(SchemaCustomization);
  } catch (error) {
    console.log(error);
  }
};
