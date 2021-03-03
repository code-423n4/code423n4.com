# C4 website (work in progress)

- Built with [Gatsby](https://www.gatsbyjs.com/docs/)
- 🔜 _Hosted on Netlify_
- 🔜 _Auto-deploys on merge to `main`_
- 🔜 _Site content editable via GitHub or Netlify CMS_

## Editing content

- **Site pages** are found in the 📁 **content** folder.
- Content is editable via GitHub pull request or Netlify CMS.
- If creating a new page in GitHub, note the frontmatter on other page files.
- Page urls are built based on the `slug` field in frontmatter.

**Site data** is found in 📁 **data** subfolders:

- 📁 **people**
- 📁 **orgs**
- 📁 **contests**
- 📁 **findings**

Because there are data relationships to be maintained, it's best to edit data using Netlify CMS.

## Develop

```
npm i
npm start
```

## Design

CSS is in `src/styles` for now.

We may break it up into components alongside React modules.
