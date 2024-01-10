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

- 📁 **findings**
- 📁 **handles**
- 📁 **orgs**
- 📁 **pages**
- 📁 **reports**

Note that `handles` allows for us to have team data as well as individual people.

Note there are data relationships to be maintained.

## Setup (for external contributors)

Fork [code-423n4/code423n4.com](https://github.com/code-423n4/code423n4.com) and clone your fork.

### Create accounts (optional):

- mailgun.com
- kickbox.com
- netlify.com
- moralis.io

### Add environment configuration

#### Required

- Generate GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with "full control of private repositories" scope and set `GITHUB_TOKEN`
- Use your GitHub username for `GITHUB_REPO_OWNER`
- Set `GITHUB_CONTEST_REPO_OWNER` to `code-423n4`
- Set `NODE_ENV` to `development`
- Use `BRANCH_NAME` from `.env.sample` OR optionally set it to whichever branch you are developing
- Use `REPO` from `.env.sample` OR optionally name your repo something else and update it here
- Use `GATSBY_MORALIS_APP_ID` and `GATSBY_MORALIS_SERVER` from `.env.sample` OR optionally set up your own moralis server and use the server url and app id from your instance. See instructions in documentation/MoralisInstructions.md

#### Optional (to enable email confirmation features)

- Use your email address for `EMAIL_SENDER`
- Use mailgun private api-key for `MAILGUN_KEY`
- Use custom or default domain from mailgun for `MAILGUN_DOMAIN`
- Generate a kickbox API key and set `KICKBOX_API_KEY`

### Create repos (optional)

In order to test applying for a judge role, create a repo named `judges`

If you submit test findings to the default test contest repo, you can find your submissions [here](https://github.com/code-423n4/2022-01-dev-test-repo-findings). Be aware: this is a public repo.

## Develop

First time setup:

```
nvm install
npm install -g yarn
yarn
```

Then and every subsequent time:

```
nvm use
yarn start
```

NOTE: To complete registration of new users, you'll need to merge PRs for warden registrations into your forked repo and then pull the changes.

## Design

Legacy CSS is in `src/styles`
Going forward, create scss modules for any new components in `src/components`
