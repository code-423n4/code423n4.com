import React from "react";
import Avatar from "react-avatar";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  return (
    <div className="wrapper-competitor" key={handle}>
      {members ? (
        <div className="wrapper-members">
          <span className="teamname">{handle}</span>
          {members.map((member) => (
            <div className="member" key={member.handle}>
              {member.image ? (
                <Avatar
                  src={member.image}
                  name={handle}
                  size="20px"
                  round="20px"
                />
              ) : (
                ""
              )}
              <span>{member.handle}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {image ? (
            <Avatar src={image} name={handle} size="20px" round="20px" />
          ) : (
            ""
          )}
          <span>{handle}</span>
        </>
      )}
    </div>
  );
};

export default LeaderboardHandle;
