# Register as a warden

Registering as a warden allows you to be listed on our [leaderboard](https://code423n4.com/leaderboard). You'll need to register your handle in order to submit a bug for a contest.

To register as a warden, follow the instructions in the [C4 docs](https://docs.code4rena.com/roles/wardens).

---

# C4 website

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
yarn
yarn start
```

## Design

CSS is in `src/styles`
