# Register as a warden

Registering as a warden allows you to be listed on our [leaderboard](https://code423n4.com/leaderboard). It's possible to do this step asynchronously from submitting a bug for a contest.

**Fork this repo and create a PR:**

1. Add a JSON file for yourself at [\_data/handles](https://github.com/code-423n4/code423n4.com/tree/main/_data/handles), and an avatar at [\_data/handles/avatars](https://github.com/code-423n4/code423n4.com/tree/main/_data/handles/avatars):

```json
{
  "handle": "maurelian",
  "image": "./avatars/maurelian.jpg",
  "link": "https://twitter.com/maurelian_"
}
```

2. If you're registering a team, add the individual handles of the team members like so:

```json
{
  "image": "",
  "handle": "pocotiempo",
  "members": ["maurelian", "0xRajeev", "mariano"]
}
```

The handle your issues are submitted under will determine where awards will go, so it's possible to be part of a team on some contests and _also_ compete as an individual on other contests.

3. Add the file for your image at [static/images/people](https://github.com/code-423n4/code423n4.com/tree/main/static/images/people)

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
