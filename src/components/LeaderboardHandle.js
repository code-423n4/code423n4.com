import React from "react";
import Avatar from "react-avatar";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  return (
    <div className="wrapper-competitor" key={handle}>
      {members ? (
        <div className="wrapper-members">
          <div className="team-wrapper">
            <span className="team-avatar">{handle.substring(0, 1)}</span>
            <span className="team-name">{handle}</span>
            <span className="team-identifier">Team</span>
          </div>
          {members.map((member) => (
            <div className="member" key={member.handle}>
              <a href={member.link}>
                <Avatar
                  src={member.image && member.image.childImageSharp.resize.src}
                  name={member.handle}
                  size="27px"
                  round="27px"
                />
                <span>{member.handle}</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <a href={link}>
          <Avatar
            src={image && image.childImageSharp.resize.src}
            name={handle}
            size="27px"
            round="27px"
          />

          <span>{handle}</span>
        </a>
      )}
    </div>
  );
};

export default LeaderboardHandle;
