import React, { useState, useEffect } from "react";

const SponsorLink = ({ sponsor, className, size }) => {
  // This is a work-around for an issue with React's rehydration function, which
  // does not account for differences in attributes
  // This approach was suggested here: https://github.com/gatsbyjs/gatsby/discussions/17914
  // And the problem is explained well here: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // TODO: Could this use the react avatar system instead? Would that be better?
  const getSponsorImg = () => {
    if (!sponsor) {
      return;
    }
    if (sponsor.link) {
      return (
        <div className="project-link__placeholder-logo">
          <a href={sponsor.link}>
            <img
              src={sponsor.image.childImageSharp.resize.src}
              alt={sponsor.name}
              {...(size ? { width: size, height: size } : {})}
            />
          </a>
        </div>
      );
    }
    return (
      <img src={sponsor.image.childImageSharp.resize.src} alt={sponsor.name} />
    );
  };

  return (
    <div className={"project-link " + (className ? className : "")}>
      {isClient ? getSponsorImg() : <div className="placeholder-img"></div>}
    </div>
  );
};

export default SponsorLink;
