// wip: endpoint for self-serve submission editing

export async function handler(event) {
  switch (event.httpMethod) {
    case "GET":
      // return a list of findings
      //   - warden (+team)
      //   - contest
      break;
    case "POST":
      // modify a specific finding
      break;
  }

  return {
    statusCode: 200,
    body: "Some Response",
  };
};
