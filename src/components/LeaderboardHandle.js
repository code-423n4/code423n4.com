import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";

const LeaderboardHandle = ({ handle, image, link, members }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMobileView(window.innerWidth <= 740 ? true : false);
    }
  }, []);

  const trimHandle = (handle) => {
    if (handle.split("").length > 15) {
      return `${handle.substring(0, 12)}...`;
    } else {
      return handle;
    }
  };

  return (
    <div className="wrapper-competitor" key={handle}>
      {members ? (
        <div className="wrapper-members">
          <div className="wrapper-team-top">
            <button
              className="team-toggle button-div"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <img
                src={
                  isExpanded
                    ? "/images/triangle-down.svg"
                    : "/images/triangle-right.svg"
                }
                alt={
                  isExpanded
                    ? "picture of a triangle down"
                    : "picture of a triangle right"
                }
                className={
                  isExpanded
                    ? "triangle triangle-down"
                    : "triangle triangle-right"
                }
              />
            </button>
            {image ? (
              <a href={link ? link : "/"}>
                <Avatar
                  src={image && image.childImageSharp.resize.src}
                  name={handle}
                  size={mobileView === false ? "27px" : "16px"}
                  round={mobileView === false ? "27px" : "16px"}
                />

                <span>{mobileView === true ? trimHandle(handle) : handle}</span>
              </a>
            ) : (
              <div className="team-wrapper">
                <span
                  className={
                    mobileView === false ? "team-avatar" : "team-avatar-small"
                  }
                >
                  {handle.substring(0, 1)}
                </span>
                <span className="team-name">{handle}</span>
              </div>
            )}
          </div>
          {isExpanded
            ? members.map((member) => (
                <div className="member team-identifier" key={member.handle}>
                  <a href={member.link}>
                    <Avatar
                      src={
                        member.image && member.image.childImageSharp.resize.src
                      }
                      name={member.handle}
                      size={mobileView === false ? "25px" : "13px"}
                      round={mobileView === false ? "25px" : "8px"}
                    />
                    <span>{member.handle}</span>
                  </a>
                </div>
              ))
            : ""}
        </div>
      ) : (
        <a href={link}>
          <Avatar
            src={image && image.childImageSharp.resize.src}
            name={handle}
            size={mobileView === false ? "27px" : "16px"}
            round={mobileView === false ? "27px" : "16px"}
          />

          <span>{mobileView === true ? trimHandle(handle) : handle}</span>
        </a>
      )}
    </div>
  );
};

export default LeaderboardHandle;
