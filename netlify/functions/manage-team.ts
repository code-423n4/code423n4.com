import dedent from "dedent";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { File } from "octokit-plugin-create-pull-request/dist-types/types";
const sharp = require("sharp");
import { Response } from "@netlify/functions/src/function/response";
import { Event } from "@netlify/functions/src/function/event";
import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

import { token } from "../_config";
import { TeamData, TeamUpdateRequest } from "../../types/user";
import { getTeamEmails, sendConfirmationEmail } from "../util/user-utils";
import { checkAuth, checkTeamAuth } from "../util/auth-utils";

const OctokitClient = Octokit.plugin(createPullRequest, createOrUpdateTextFile);
const octokit = new OctokitClient({ auth: token });

function isDangerous(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}

exports.handler = async (event: Event): Promise<Response> => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Method not allowed",
        }),
        headers: { Allow: "POST" },
      };
    }

    const data = JSON.parse(event.body!);
    const {
      teamName,
      image,
      link,
      members,
      polygonAddress,
      ethereumAddress,
    }: TeamUpdateRequest = data;
    const username = event.headers["c4-user"];

    if (!teamName || !teamName.oldValue || !teamName.newValue) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Team name is required",
        }),
      };
    }

    if (teamName.newValue.length > 25) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Team name's length is limited to 25 characters.",
        }),
      };
    }

    if (!polygonAddress || !polygonAddress.newValue) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Polygon address is required",
        }),
      };
    }

    if (isDangerous(teamName.newValue)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Team name can only use alphanumeric characters [a-zA-Z0-9], underscores (_), and hyphens (-).",
        }),
      };
    }

    if (!members || !members.newValue || members.newValue.length < 2) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: "Teams must have at least 2 members",
        }),
      };
    }

    try {
      if (!(await checkAuth(event))) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: "Unauthorized",
          }),
        };
      }
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }

    let oldTeamData;
    try {
      oldTeamData = await checkTeamAuth(teamName.oldValue, username);
      delete oldTeamData.imageUrl;
    } catch (error) {
      return {
        statusCode: error.status,
        body: JSON.stringify({ error: error.message }),
      };
    }

    const paymentAddresses = [
      { chain: "polygon", address: polygonAddress.newValue },
    ];
    if (ethereumAddress && ethereumAddress.newValue) {
      paymentAddresses.push({
        chain: "ethereum",
        address: ethereumAddress.newValue,
      });
    }

    const newTeamData: TeamData = {
      ...oldTeamData,
      handle: teamName.newValue,
      members: members.newValue,
      paymentAddresses,
    };

    if (link && link.newValue) {
      newTeamData.link = link.newValue;
    } else {
      delete newTeamData.link;
    }

    let avatarFilename = "";
    let base64Avatar = "";
    if (image) {
      const decodedImage = Buffer.from(image, "base64");
      const { data, info } = await sharp(decodedImage)
        .resize({ width: 512 })
        .toBuffer({ resolveWithObject: true });
      base64Avatar = data.toString("base64");
      avatarFilename = `${teamName.newValue}.${info.format}`;
      newTeamData.image = `./avatars/${teamName.newValue}.${info.format}`;
    }

    const files: { [path: string]: string | File } = {
      [`_data/handles/${teamName.newValue}.json`]: JSON.stringify(
        newTeamData,
        null,
        2
      ),
    };
    if (image) {
      files[`_data/handles/avatars/${avatarFilename}`] = {
        content: base64Avatar,
        encoding: "base64",
      };
    }

    const title = `Edit team ${teamName.oldValue}`;
    const body = `This auto-generated PR modifies the team ${teamName.oldValue}`;
    const branchName = `team/${teamName.newValue}`;

    try {
      const res = await octokit.createPullRequest({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.REPO!,
        title,
        body,
        head: branchName,
        base: process.env.BRANCH_NAME,
        changes: [
          {
            files,
            commit: title,
          },
        ],
      });

      if (!res) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Failed to create pull request." }),
        };
      }

      /*
       * If teamName changed, delete the old team json file.
       * This must be done after the pull request is created because
       * the branch does not exist before that and `createOrUpdateTextFile`
       * does not create a branch if you provide a non-existent branch name.
       */
      if (teamName.newValue !== teamName.oldValue) {
        const removedFile = await octokit.createOrUpdateTextFile({
          owner: process.env.GITHUB_REPO_OWNER!,
          repo: process.env.REPO!,
          path: `_data/handles/${teamName.oldValue}.json`,
          content: null,
          message: `File replaced with ${teamName.newValue}.json by ${username}`,
          branch: branchName,
        });

        if (!removedFile.deleted) {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Problem deleting old file" }),
          };
        }
      }

      const newMemberEmails = await getTeamEmails(newTeamData);
      const oldMemberEmails = await getTeamEmails(oldTeamData);
      const emailSubject = `Code4rena team "${teamName.oldValue}" has been modified`;

      const emailBody = dedent`
        Changes to the team ${teamName.oldValue} have been requested:

        Team name: ${teamName.newValue}

        Members: ${members.newValue.join(", ")}

        Polygon address: ${polygonAddress.newValue}
        ${
          ethereumAddress &&
          (ethereumAddress.newValue || ethereumAddress.oldValue)
            ? "Ethereum address: " + ethereumAddress.newValue
            : ""
        }
        ${
          link && (link.newValue || link.oldValue)
            ? "Link: " + link.newValue
            : ""
        }

        You can see the PR here: ${res.data.html_url}
      `;
      await sendConfirmationEmail(
        [...newMemberEmails, ...oldMemberEmails],
        emailSubject,
        emailBody
      );

      return {
        statusCode: 201,
        body: JSON.stringify({ message: `Created PR ${res.data.number}` }),
      };
    } catch (error) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify({ error: error.response.data.message.toString() }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
