const { Client } = require("@notionhq/client");
const dedent = require("dedent");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { verify } = require("hcaptcha");

const { apiKey, domain } = require("./_config");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: apiKey });

const notionKey = process.env.NOTION_KEY;
const notionDbId = process.env.NOTION_WARDEN_CERTIFICATION_DATABASE_ID;

const notion = new Client({ auth: notionKey });

interface NotionCertifiedContributorApplication {
  parent: {
    database_id: string;
  };
  properties: {
    "Warden Handle": {
      title: {
        text: {
          content: string;
        };
      }[];
    };
    Status: {
      select: {
        name: string;
      };
    };
    "GitHub Username": {
      rich_text: [
        {
          type: "text";
          text: {
            content: string;
          };
        }
      ];
    };
    "E-mail": {
      type: "email";
      email: string;
    };
  };
}

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { Allow: "POST" },
    };
  }

  const { authorization } = event.headers;
  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Authorization failed" }),
    };
  }

  const { success } = await verify(process.env.HCAPTCHA_SECRET, authorization);
  if (!success) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Authorization failed" }),
    };
  }

  const ticket = JSON.parse(event.body);
  if (!ticket.wardenHandle || !ticket.githubUsername || !ticket.emailAddress) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: "Contact info is required" }),
    };
  }

  try {
    const body: NotionCertifiedContributorApplication = {
      parent: {
        database_id: notionDbId,
      },
      properties: {
        "Warden Handle": {
          title: [
            {
              text: {
                content: ticket.wardenHandle,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "Applied",
          },
        },
        "GitHub Username": {
          rich_text: [
            {
              type: "text",
              text: {
                content: ticket.githubUsername,
              },
            },
          ],
        },
        "E-mail": {
          type: "email",
          email: ticket.emailAddress,
        },
      },
    };

    await notion.pages.create(body);
  } catch (err) {
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message || "Internal server error" }),
    };
  }

  // Send confirmation email
  const recipients = `${ticket.emailAddress}, submissions@code423n4.com`;
  const text = dedent`
    Thank you for applying to be a certified Code4rena warden! Here's what to expect next:

    1. The DAO's AML/KYC agent, Provenance, will contact you to certify your identity. Please watch for an email that will come directly from Provenance (https://provenance.company/).
    2. Provenance will lead you through your identity verification process, and ask you to sign an agreement binding you to a code of conduct and non-disclosure. Code4 Corporation and the Code4rena DAO do NOT have access to your personal information, simply the verified knowledge that you have (or have not) been certified.
    3. Code4 Corporation will contact you to let you know when your application has been approved.

    This process is entirely managed by humans, so it can take a while to complete. We appreciate your patience with the process!
    
    The Code4 team
    `;

  const html =
    "<p>Thank you for applying to be a certified Code4rena warden! Here's what to expect next:</p>" +
    "<ol>" +
    '<li>The DAO\'s AML/KYC agent, <a href="https://provenance.company/">Provenance</a>, ' +
    "will contact you to certify your identity. <strong>Please watch for an email that will come directly " +
    "from Provenance (https://provenance.company/).</strong></li>" +
    "<li>Provenance will lead you through your identity verification process, and ask you to sign an " +
    "agreement binding you to a code of conduct and non-disclosure. Code4 Corporation and the Code4rena " +
    "DAO do NOT have access to your personal information, simply the verified knowledge that you have " +
    "(or have not) been certified.</li>" +
    "<li>Code4 Corporation will contact you to let you know when your application has been approved.</li>" +
    "</ol>" +
    "<p>This process is entirely managed by humans, so it can take a while to complete. We appreciate your patience with the process!</p>" +
    "<p>The Code4 team</p>";

  const mailOptions = {
    from: "submissions@code423n4.com",
    to: recipients,
    subject: `Certified warden application for ${ticket.wardenHandle} has been received!`,
    text,
    html,
  };

  return mg.messages
    .create(domain, mailOptions)
    .then(() => {
      return {
        statusCode: 200,
        body: "Your request has been submitted",
      };
    })
    .catch((err) => {
      return {
        statusCode: err.status || 500,
        body: JSON.stringify({ error: err.message }),
      };
    });
}

export { handler };
