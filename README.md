# Register as a warden

Registering as a warden allows you to be listed on our [leaderboard](https://code423n4.com/leaderboard). You'll need to register your handle in order to submit a bug for a contest.

1. Visit our [warden registration page](https://code423n4.com/warden-registration/) and submit your details. A C4 team member will then approve your handle, allowing you to participate in contests.
2. Join our [Discord](https://discord.gg/code4rena). This step is optional, but highly recommended. We suggest you use the same name in Discord as your registered handle; this will allow us to notify you when you receive an award from a contest.

The handle your issues are submitted under will determine where awards will go, so it's possible to be part of a team on some contests and _also_ compete as an individual on other contests.

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
