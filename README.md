# C4 website (work in progress)

- Built with [Gatsby](https://www.gatsbyjs.com/docs/)
- Hosted on Netlify
- Auto-deploys on merge to `main`
- Site content and data editable on GitHub

## Editing content

- **Site pages** are found in the 📁 **content** folder.
- Content is editable via GitHub pull request or Netlify CMS.
- If creating a new page in GitHub, note the frontmatter on other page files.
- Page urls are built based on the `slug` field in frontmatter.

**Site data** is found in 📁 **data** subfolders:

- 📁 **contests**
- 📁 **findings**
- 📁 **handles**
- 📁 **orgs**

Note that `handles` allows for us to have team data as well as individual people.

Note there are data relationships to be maintained.

## Develop

```
npm i
npm start
```

## Design

CSS is in `src/styles`
