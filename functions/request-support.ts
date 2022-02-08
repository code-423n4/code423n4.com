const { Client } = require("@notionhq/client");
const { verify } = require("hcaptcha");

const notionKey = process.env.NOTION_KEY;
const helpdeskId = process.env.NOTION_HELPDESK_DATABASE_ID;

const notion = new Client({ auth: notionKey });

function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

const ticketTags = {
  wardenRegistration: {
    name: "Warden registration 🐺",
    color: "green",
  },
  walletUpdate: {
    name: "Update wallet",
    color: "purple",
  },
  bug: {
    name: "Bug 🐞",
    color: "red",
  },
  airdropHelp: {
    name: "Airdrop 🌧",
    color: "blue",
  },
  findingsChange: {
    name: "Update or withdraw finding 📝",
    color: "blue",
  },
  docs: {
    name: "C4 docs 📚",
    color: "yellow",
  },
  suggestion: {
    name: "Process improvement 🔁",
    color: "orange",
  },
};

interface NotionHelpdeskTicket {
  parent: {
    database_id: string;
  };
  properties: {
    Name: {
      title: {
        text: {
          content: string;
        };
      }[];
    };
    Tags?: {
      multi_select: {
        name: string;
        color: string;
      }[];
    };
    Status: {
      select: {
        name: string;
      };
    };
    "Discord Handle"?: {
      rich_text: [
        {
          type: "text";
          text: {
            content: string;
          };
        }
      ];
    };
    Email?: {
      type: "email";
      email: string;
    };
  };
  children: [
    {
      object: "block";
      type: "paragraph";
      paragraph: {
        text: [
          {
            type: "text";
            text: {
              content: string;
            };
          }
        ];
      };
    }
  ];
}

async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method not allowed",
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

    const { success } = await verify(
      process.env.HCAPTCHA_SECRET,
      authorization
    );
    if (!success) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authorization failed" }),
      };
    }

    const ticket = JSON.parse(event.body);
    if (!ticket.discordHandle && !ticket.email) {
      return {
        statusCode: 422,
        body: "Contact info is required",
      };
    }

    if (ticket.discordHandle && isDangerous(ticket.discordHandle)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Handle can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    const body: NotionHelpdeskTicket = {
      parent: {
        database_id: helpdeskId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: ticket.subject,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "Not Started",
          },
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            text: [
              {
                type: "text",
                text: {
                  content: ticket.description,
                },
              },
            ],
          },
        },
      ],
    };

    if (ticketTags[ticket.request]) {
      body.properties.Tags = {
        multi_select: [ticketTags[ticket.request]],
      };
    }

    if (ticket.discordHandle) {
      body.properties["Discord Handle"] = {
        rich_text: [
          {
            type: "text",
            text: {
              content: ticket.discordHandle,
            },
          },
        ],
      };
    }

    if (ticket.email) {
      body.properties.Email = {
        type: "email",
        email: ticket.email,
      };
    }

    const response = await notion.pages.create(body);

    return {
      statusCode: 201,
      body: "Your request has been submitted",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
}

export { handler };
