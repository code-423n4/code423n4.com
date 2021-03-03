module.exports = {
  siteMetadata: {
    title: `code423n4.com`,
    description: `C4 website`,
    siteUrl: `https://code423n4.com`,
    author: `Adam Avenir (@sockdrawermoney)`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/orgs`,
        name: `orgs`,
        ignore: ["README.*"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/people`,
        name: `people`,
        ignore: ["README.*"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/contests`,
        name: `contests`,
        ignore: ["README.*"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/findings`,
        name: `findings`,
        ignore: ["README.*"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content`,
        name: "pages",
        ignore: ["**/README.*"],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // TODO: configure netlify cms
    // {
    //   resolve: `gatsby-plugin-netlify-cms`,
    //   options: {
    //     manualInit: true,
    //     modulePath: `${__dirname}/src/cms/cms.js`,
    //     htmlTitle: "code423n4.com admin",
    //   },
    // },
  ],
};
