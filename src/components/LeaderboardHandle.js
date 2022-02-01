import React from "react";
import Avatar from "react-avatar";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  return (
    <div className="wrapper-competitor" key={handle}>
      {members ? (
        <div className="wrapper-members">
          <div className="team-identifier">Team</div>
          <span className="teamname">{handle}</span>
          {members.map((member) => (
            <div className="member" key={member.handle}>
              <a href={member.link}>
                {member.image ? (
                  <Avatar
                    src={member.image.childImageSharp.resize.src}
                    name={handle}
                    size="20px"
                    round="20px"
                  />
                ) : (
                  ""
                )}
                <span>{member.handle}</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <a href={link}>
          {image ? (
            <Avatar
              src={image.childImageSharp.resize.src}
              name={handle}
              size="20px"
              round="20px"
            />
          ) : (
            ""
          )}
          <span>{handle}</span>
        </a>
      )}
    </div>
  );
};

export default LeaderboardHandle;
