import path from "path";
import SchemaCustomization from "./schema";
import { createFilePath } from "gatsby-source-filesystem";
import fetch from "node-fetch";

const response = fetch("https://github.com/");
const body = response.text;

console.log(body);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

function contestSlug(contestNode) {
  const startDate = new Date(contestNode.start_time);
  const year = startDate.getFullYear();
  const month = `${startDate.getMonth() + 1}`.padStart(2, "0");
  const title = slugify(contestNode.title);
  const slug = `${year}-${month}-${title}`;

  return slug;
}

function contestPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}`;
}

function contestSubmissionPermalink(contestNode) {
  return `/contests/${contestSlug(contestNode)}/submit`;
}

let test64 = `IyDirZDvuI8gU2xpbmdzaG90IGNvbnRlc3QgZGV0YWlscwotICQzMywyNTAg
d29ydGggb2YgRVRIIG1haW4gYXdhcmQgcG90Ci0gJDEsNzUwIHdvcnRoIG9m
IEVUSCBnYXMgb3B0aW1pemF0aW9uIGF3YXJkIHBvdAotIEpvaW4gW0M0IERp
c2NvcmRdKGh0dHBzOi8vZGlzY29yZC5nZy9jb2RlNHJlbmEpIHRvIHJlZ2lz
dGVyCi0gU3VibWl0IGZpbmRpbmdzIFt1c2luZyB0aGUgQzQgZm9ybV0oaHR0
cHM6Ly9jb2RlNDIzbjQuY29tLzIwMjEtMTAtc2xpbmdzaG90LWZpbmFuY2Ut
Y29udGVzdC9zdWJtaXQpCi0gW1JlYWQgb3VyIGd1aWRlbGluZXMgZm9yIG1v
cmUgZGV0YWlsc10oaHR0cHM6Ly9kb2NzLmNvZGU0cmVuYS5jb20vcm9sZXMv
d2FyZGVucykKLSBTdGFydHMgT2N0b2JlciAzMCwgMjAyMSAwMDowMCBVVEMK
LSBFbmRzIE5vdmVtYmVyIDEsIDIwMjEgMjM6NTkgVVRDCgojIyDinKggQ29u
dHJhY3RzCiMjIyBTbGluZ3Nob3QgKExPQzogMTgyKQpTbGluZ3Nob3Quc29s
IGRlZmluZXMgdGhlIGdlbmVyYWwgbG9naWMgYnkgd2hpY2ggYSB0cmFuc2Fj
dGlvbiBpcyBoYW5kbGVkIGFuZCBleGVjdXRlZC4KClRoZSBzcGVjaWZpYyBs
b2dpYyBmb3IgZWFjaCBERVgvQU1NIGlzIGRlZmluZWQgd2l0aGluIGl0cyBv
d24gY29ycmVzcG9uZGluZyBtb2R1bGUgdGhhdCBpcyBzdG9yZWQgaW4gdGhl
IG1vZHVsZSByZWdpc3RyeS4KClNsaW5nc2hvdC5zb2wgcmVmZXJlbmNlcyB0
aGVzZSBtb2R1bGVzIHRvIGFwcHJvcHJpYXRlbHkgZXhlY3V0ZSBhIHRyYWRl
LiBTbGluZ3Nob3Quc29sIGFsc28gcGVyZm9ybXMgc29tZSBzYWZldHkgY2hl
Y2tzIHRvIGFjY291bnQgZm9yIHNsaXBwYWdlIGFuZCBzZWN1cml0eS4gU2xp
bmdzaG90LnNvbCBleHBlY3QgcGFyYW1ldGVycyB0byBiZSBwYXNzZWQgZnJv
bSB0aGUgU2xpbmdzaG90IGJhY2tlbmQgdGhhdCBwcm92aWRlIHRoZSBkZXRh
aWxzIHJlbGF0ZWQgdG8gaG93IGEgZ2l2ZW4gdHJhbnNhY3Rpb24gc2hvdWxk
IGJlIGV4ZWN1dGVkLgoKYHJlc2N1ZVRva2Vuc2AgYW5kIGByZXNjdWVUb2tl
bnNGcm9tRXhlY3V0aW9uZXJgIGNhbiBiZSBnYW1lZCBob3dldmVyIGl0IGlz
IG5vdCBhIGNvbmNlcm4uIFRoZXkgYXJlIGluIHBsYWNlICJqdXN0IGluIGNh
c2UiIGFuZCBzaG91bGQgbm90IGJlIHVzZWQgaW4gdGhlIGZpcnN0IHBsYWNl
LgoKIyMjIyBFeHRlcm5hbCBjYWxscwotIEFwcHJvdmFsSGFuZGxlcgotIEV4
ZWN1dGlvbmVyCi0gTW9kdWxlUmVnaXN0cnkKIyMjIyBMaWJyYXJpZXMgdXNl
ZAotIFNhZmVFUkMyMAotIENvbmNhdFN0cmluZ3MKCiMjIyBNb2R1bGVSZWdp
c3RyeSAoTE9DOiA3NikKQWxsIG1vZHVsZXMgbXVzdCBiZSByZWdpc3RlcmVk
IGluIE1vZHVsZVJlZ2lzdHJ5LnNvbC4gT25seSB0cnVzdGVkIGNvZGUgY2Fu
IGJlIHJlZ2lzdGVyZWQgYXMgYSBtb2R1bGUgYnkgcmVnaXN0cnkgYWRtaW4u
CgojIyMgQXBwcm92YWxIYW5kbGVyIChMT0M6IDQ0KQpJdCBoYW5kbGVzIGFs
bCB1c2VycyBhcHByb3ZhbHMuIEl0IGV4aXN0cyB0byBzZXBhcmF0ZSB0aGUg
YXBwcm92YWxzIGZyb20gZXhlY3V0aW9uIGxheWVyLiBPcGVyYXRlZCBieSBT
eXN0ZW0gYWRtaW4uCgpTeXN0ZW0gYWRtaW4gaXMgYSBtdWx0aXNpZyBhbmQg
aXMgdGhlIG1vc3QgdHJ1c3RlZCByb2xlIGluIHRoZSBzeXN0ZW0uIEl0IGhh
cyB0aGUgcG93ZXIgdG8gYWNjZXB0IG5ldyB2ZXJzaW9uIG9mIFNsaW5nc2hv
dCBwcm90b2NvbCBhbmQgY2Fycnkgb3ZlciBhbGwgdXNlciBhcHByb3ZhbHMu
CgojIyMgRXhlY3V0aW9uZXIgKExPQzogNzIpCkNyZWF0ZXMgc2VwYXJhdGUg
ZXhlY3V0aW9uIGVudmlyb25tZW50IGZvciB0cmFkZXMuIEJpZyByZWFzb24g
Zm9yIHRoaXMgY29udHJhY3QgdG8gZXhpc3RzIGlzIHRvIGRlY291cGxlIHJv
bGVzIG9mIE1vZHVsZVJlZ2lzdHJ5LnNvbCBhZG1pbiBhbmQgU3lzdGVtIGFk
bWluLgoKTW9kdWxlUmVnaXN0cnkuc29sIGFkbWluIHNob3VsZCBiZSBhYmxl
IHRvIHJlZ2lzdGVyIG5ldyBtb2R1bGVzIGF0IHdpbGwgZm9yIHNtb290aCBk
ZXZlbG9wbWVudCBwcm9jZXNzLiBUaGlzIHJvbGUgaXMgdHJ1c3RlZCBhZG1p
biBob3dldmVyLCBoZSBzaG91bGQgbm90IGJlIGFibGUgdG8gaW50cm9kdWNl
IGFueSBzeXN0ZW0gd2lkZSBiYWNrZG9vcnMgYnkgcmVnaXN0ZXJpbmcgbWFs
aWNpb3VzIG1vZHVsZXMuIEZvciBleGFtcGxlLCBpdCBzaG91bGQgbm90IGJl
IHBvc3NpYmxlIGZvciBhIE1vZHVsZVJlZ2lzdHJ5LnNvbCBhZG1pbiB0byBh
YnVzZSB1c2VyJ3MgYXBwcm92YWxzIGdpdmVuIHRvIEFwcHJvdmFsSGFuZGxl
ci5zb2wuCgojIyMjIEV4dGVybmFsIGNhbGxzCi0gQmFsYW5jZXJWMk1vZHVs
ZU1hdGljCi0gQ3VydmVNb2R1bGUKLSBTdXNoaVN3YXBNb2R1bGUKLSBVbmlz
d2FwTW9kdWxlCiMjIyMgTGlicmFyaWVzIHVzZWQKLSBTYWZlRVJDMjAKLSBD
b25jYXRTdHJpbmdzCgojIyMgQWRtaW5hYmxlIChMT0M6IDI0KQpBY2Nlc3Mg
Y29udHJvbCBjb250cmFjdCBiYXNlZCBvbiBPcGVuWmVwcGVsaW4ncyBBY2Nl
c3NDb250cm9sLgoKIyMjIEJhbGFuY2VyTW9kdWxlIChMT0M6IDU5KQpUcmFk
aW5nIG1vZHVsZSBmb3IgQmFsYW5jZXIgcHJvdG9jb2wuCiMjIyMgRXh0ZXJu
YWwgY2FsbHMKLSBCYWxhbmNlcgojIyMjIExpYnJhcmllcyB1c2VkCi0gTGli
RVJDMjBUb2tlbgoKIyMjIEJhbGFuY2VyVjJNb2R1bGVNYXRpYyAoTE9DOiA3
MikKVHJhZGluZyBtb2R1bGUgZm9yIEJhbGFuY2VyVjIgcHJvdG9jb2wuCiMj
IyMgRXh0ZXJuYWwgY2FsbHMKLSBCYWxhbmNlclYyCiMjIyMgTGlicmFyaWVz
IHVzZWQKLSBMaWJFUkMyMFRva2VuCgojIyMgQ3VydmVNb2R1bGUgKExPQzog
NjIpClRyYWRpbmcgbW9kdWxlIGZvciBDdXJ2ZSBwcm90b2NvbC4KIyMjIyBF
eHRlcm5hbCBjYWxscwotIEN1cnZlCiMjIyMgTGlicmFyaWVzIHVzZWQKLSBM
aWJFUkMyMFRva2VuCgojIyMgU3VzaGlTd2FwTW9kdWxlIChMT0M6IDEzKQpU
cmFkaW5nIG1vZHVsZSBmb3IgU3VzaGlTd2FwIHByb3RvY29sLgojIyMjIEV4
dGVybmFsIGNhbGxzCi0gU3VzaGlTd2FwCiMjIyMgTGlicmFyaWVzIHVzZWQK
LSBMaWJFUkMyMFRva2VuCgojIyMgVW5pc3dhcE1vZHVsZSAoTE9DOiAxMykK
VHJhZGluZyBtb2R1bGUgZm9yIFVuaXN3YXAgcHJvdG9jb2wuCiMjIyMgRXh0
ZXJuYWwgY2FsbHMKLSBVbmlzd2FwCiMjIyMgTGlicmFyaWVzIHVzZWQKLSBM
aWJFUkMyMFRva2VuCg==`;

// GitHub's api urls are structured like this: /repos/{owner}/{repo}/contents/{path}
// https://docs.github.com/en/rest/reference/repos#contents
const API = "https://api.github.com/repos/code-423n4";

// https://github.com/code-423n4/2021-10-slingshot
function getRepoName(contestNode) {
  let regex = "([^/]+$)";
  let url = contestNode.repo;

  let result = url.match(regex);
  let repoName = result[0];
  return repoName;
}

async function fetchReadmeMarkdown(contestNode) {
  let url = `${API}/${getRepoName(contestNode)}/contents/README.md`; // Example final url: https://github.com/code-423n4/2021-10-slingshot/blob/main/README.md
  const response = await fetch(url);
  const data = await response.json();
  var buff = Buffer.from(data.content, "base64");

  // let buff = Buffer.from(test64, "base64"); // replace the above with this for testing. also make it not async
  let rawMarkdown = buff.toString("ascii");

  return rawMarkdown;
}

const queries = {
  contests: `query {
    contests: allContestsCsv(sort: { fields: end_time, order: ASC }) {
      edges {
        node {
          id
          contestid
          title
          start_time(formatString: "YYYY-MM")
          findingsRepo
          fields {
            submissionPath
            contestPath
            readmeContent
          }
        }
      }
    }
  }
`,
};

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
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    const parent = getNode(node.parent);
    let slug;
    if (node.frontmatter.slug) {
      // if a slug is defined, use that.
      slug = "/" + node.frontmatter.slug;
    } else {
      // otherwise use the file path
      slug = createFilePath({ node, getNode });
    }
    createNodeField({
      node,
      name: `collection`,
      value: parent.sourceInstanceName,
    });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }

  if (node.internal.type === `ContestsCsv`) {
    createNodeField({
      node,
      name: `contestPath`,
      value: contestPermalink(node),
    });
    createNodeField({
      node,
      name: `submissionPath`,
      value: contestSubmissionPermalink(node),
    });
    createNodeField({
      node,
      name: `readmeContent`,
      value: fetchReadmeMarkdown(node),
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  let contests = await graphql(queries.contests);
  const formTemplate = path.resolve("./src/layouts/ReportForm.js");
  const contestTemplate = path.resolve("./src/layouts/ContestLayout.js");
  contests.data.contests.edges.forEach((contest) => {
    if (contest.node.findingsRepo) {
      createPage({
        path: contest.node.fields.submissionPath,
        component: formTemplate,
        context: {
          contestId: contest.node.contestid,
        },
      });
    }

    createPage({
      path: contest.node.fields.contestPath,
      component: contestTemplate,
      context: {
        contestId: contest.node.contestid,
      },
    });
  });
};
