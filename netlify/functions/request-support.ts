const { Client } = require("@notionhq/client");
const { verify } = require("hcaptcha");

import { checkAuth } from "../util/auth-utils";

const notionKey = process.env.NOTION_KEY!;
const helpdeskId = process.env.NOTION_HELPDESK_DATABASE_ID!;

const notion = new Client({ auth: notionKey });

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
    color: "pink",
  },
  docs: {
    name: "C4 docs 📚",
    color: "yellow",
  },
  suggestion: {
    name: "Process improvement 🔁",
    color: "orange",
  },
  team: {
    name: "Team request 👏",
    color: "blue",
  },
  sensitiveDisclosure: {
    name: "Sensitive disclosure 🚨",
    color: "yellow",
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
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { Allow: "POST" },
    };
  }

  const { authorization } = event.headers;
  const xAuthorization = event.headers["x-authorization"];
  const username = event.headers["c4-user"];

  if (!authorization && (!username || !xAuthorization)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Authorization failed" }),
    };
  }

  const isAuthenticated = await checkAuth(event);

  // must have valid username and session or captcha verification
  if (authorization) {
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
  } else {
    if (!isAuthenticated) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }
  }

  const ticket = JSON.parse(event.body);
  if (!ticket.discordHandle && !ticket.email) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: "Contact info is required" }),
    };
  }

  try {
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

    if (isAuthenticated) {
      body.properties["Authenticated User"] = {
        type: "checkbox",
        checkbox: true,
      };
      body.properties["Submitted By"] = {
        rich_text: [
          {
            type: "text",
            text: {
              content: username,
            },
          },
        ],
      };
    }

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
