const { Client } = require("@notionhq/client");
const { verify } = require("hcaptcha");

const notionKey = process.env.NOTION_KEY;
const notionDbId = process.env.NOTION_WARDEN_CERTIFICATION_DATABASE_ID;

const notion = new Client({ auth: notionKey });

interface NotionWardenCertificationApplication {
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
    const body: NotionWardenCertificationApplication = {
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

    return {
      statusCode: 201,
      body: "Your request has been submitted",
    };
  } catch (err) {
    return {
      statusCode: err.status,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

export { handler };
