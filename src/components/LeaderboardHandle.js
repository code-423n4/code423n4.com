import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import ExternalLink from "./ExternalLink";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  // TODO: clean up repeated code
  return (
    <div className="leaderboard-handle" key={handle}>
      {members ? (
        <div className="leaderboard-handle__team">
          <details className="team-wrapper">
            <summary className="team-name summary--right-marker">
              {image ? (
                <>
                  <span>{handle}</span>
                  <Avatar src={image} name={handle} size="25px" round="25px" />
                </>
              ) : (
                <>
                  <span>{handle}</span>
                  <span className="leaderboard__team-avatar--none">
                    {handle.substring(0, 1)}
                  </span>
                </>
              )}
            </summary>
            {members.map((member) => (
              <div className="leaderboard__team-member" key={member.handle}>
                {member.link.length > 0 ? (
                  <ExternalLink to={member.link} alt={member.handle}>
                    <Avatar
                      src={member.image}
                      name={member.handle}
                      size="30px"
                      round="30px"
                    />
                    <span>{member.handle}</span>
                  </ExternalLink>
                ) : (
                  <>
                    <Avatar
                      src={member.image}
                      name={member.handle}
                      size="30px"
                      round="30px"
                    />
                    <span>{member.handle}</span>
                  </>
                )}
              </div>
            ))}
          </details>
        </div>
      ) : link ? (
        <ExternalLink to={link} alt={handle}>
          <Avatar src={image} name={handle} size="25px" round="25px" />
          <span className="leaderboard-handle__name">{handle}</span>
        </ExternalLink>
      ) : (
        <span className="leaderboard-handle__team">
          <Avatar src={image} name={handle} size="25px" round="25px" />

          <span className="leaderboard-handle__name">{handle}</span>
        </span>
      )}
    </div>
  );
};

export default LeaderboardHandle;
