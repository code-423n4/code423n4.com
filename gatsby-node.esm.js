// import path from "path";
import SchemaCustomization from "./schema";
import { createFilePath } from "gatsby-source-filesystem";

exports.createSchemaCustomization = (helpers) => {
  const { actions } = helpers;
  const { createTypes } = actions;
  try {
    createTypes(SchemaCustomization);
  } catch (error) {
    console.log(error);
  }
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    const parent = getNode(node.parent);
    let slug;
    if (node.frontmatter.slug) {
      // if a slug is defined, use that.
      slug = "/" + node.frontmatter.slug;
      // console.log("slug from frontmatter", slug)
    } else {
      // otherwise use the file path
      slug = createFilePath({ node, getNode });
      // slug = createFilePath({ node, getNode, basePath: `content` })
      // console.log("slug from path", slug)
    }
    console.log('slug', slug)
    createNodeField({
      node,
      name: `collection`,
      value: parent.sourceInstanceName,
    })
    
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
// exports.createPages = async ({ graphql, actions, reporter }) => {
//   const { createPage } = actions
//   // const PageTemplate = path.resolve(`./src/templates/PageTemplate.js`);
//   
//   const result = await graphql(`
//     query {
//       allMarkdownRemark {
//         edges {
//           node {
//             frontmatter {
//               title
//             }
//             html
//             fields {
//               slug
//               collection
//             }
//           }
//         }
//       }
//     }
//   `)
//   
//   if (result.errors) {
//     reporter.panicOnBuild(
//       `Error loading content`,
//       result.errors
//     )
//     return
//   }
//   
// 
//   result.data.allMarkdownRemark.edges.forEach(({ node }) => {
//     console.log(node.fields.slug)
//     createPage({
//       path: node.fields.slug,
//       component: path.resolve(`./src/templates/PageTemplate.js`),
//       context: {
//         slug: node.fields.slug,
//         title: node.frontmatter.title,
//         html: node.html
//       },
//     })
//   })
// }
