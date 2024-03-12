require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

function csvDatetimeParser(item) {
  return new Date(item);
}

function csvBooleanParser(item) {
  return item === "True";
}

const plugins = [
  `gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/_data/orgs`,
      name: `orgs`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/_data/handles`,
      name: `handles`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/_data/bots`,
      name: `bots`,
    },
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      path: `${__dirname}/_data/pages`,
      name: `pages`,
    },
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      path: `${__dirname}/_data/reports`,
      name: `reports`,
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `gatsby-remark-autolink-headers`,
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
        {
          resolve: "gatsby-remark-emojis",
          options: {
            // Deactivate the plugin globally (default: true)
            active: true,
            // Add a custom css class
            class: "emoji-icon",
            // In order to avoid pattern mismatch you can specify
            // an escape character which will be prepended to the
            // actual pattern (e.g. `#:poop:`).
            // escapeCharacter : '\\', // (default: '')
            // Select the size (available size: 16, 24, 32, 64)
            size: 64,
            // Add custom styles
            styles: {
              display: "inline",
              margin: "0",
              "margin-top": "1px",
              position: "relative",
              top: "5px",
              width: "25px",
            },
          },
        },
        {
          resolve: `gatsby-remark-vscode`,
          options: {
            theme: "Dark+ (default dark)",
            languageAliases: {
              solidity: "js",
              sol: "js",
            },
          },
        },
        {
          resolve: `gatsby-remark-mathjax`,
          options: {},
        },
      ],
    },
  },
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-transformer-csv`,
    options: {
      colParser: {
        contestid: `number`,
        start_time: csvDatetimeParser,
        end_time: csvDatetimeParser,
        hide: csvBooleanParser,
        contest: `number`,
      },
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`],
      defaultLayouts: {
        reports: require.resolve("./src/templates/DefaultLayout.js"),
        default: require.resolve("./src/templates/DefaultLayout.js"),
      },
    },
  },
  `gatsby-plugin-sass`,
];

module.exports = {
  siteMetadata: {
    title: `code423n4.com`,
    description: `C4 website`,
    siteUrl: `https://code423n4.com`,
    author: `Adam Avenir (@sockdrawermoney)`,
  },
  plugins,
};
