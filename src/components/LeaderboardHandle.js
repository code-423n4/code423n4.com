import React from "react";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  // TODO: handle teams
  console.log(handle, image, link, members);

  return (
    <div className="wrapper-competitor">
      {image ? <img src={image} alt={handle} /> : ""}
      <span>{handle}</span>
      {members ? (
        <div className="wrapper-members">
          {members.map((member) => (
            <div className="member">
              <img src={member.image} alt={member.handle} />
              <span>{member.handle}</span>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LeaderboardHandle;
