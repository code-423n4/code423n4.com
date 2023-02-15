import React, { useState, useEffect } from "react";

const SponsorLink = ({ sponsor }) => {
  // This is a work-around for an issue with React's rehydration function, which
  // does not account for differences in attributes
  // This approach was suggested here: https://github.com/gatsbyjs/gatsby/discussions/17914
  // And the problem is explained well here: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const getSponsorImg = () => {
    if (!sponsor) {
      return;
    }
    if (sponsor.link) {
      return (
        <a href={sponsor.link}>
          <img
            src={sponsor.image.childImageSharp.resize.src}
            alt={sponsor.name}
          />
        </a>
      );
    }
    return (
      <img src={sponsor.image.childImageSharp.resize.src} alt={sponsor.name} />
    );
  };

  return (
    <div className="sponsor-link">
      {isClient ? (
        getSponsorImg()
      ) : (
        <div className="sponsor-link__placeholder-logo">
          {sponsor.name.charAt(0)}
        </div>
      )}
    </div>
  );
};

export default SponsorLink;
