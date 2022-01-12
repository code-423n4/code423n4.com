import React, { useState, useEffect }  from 'react'

const SponsorLink = ({ sponsor }) => {
  // @todo: Find a better solution to the below issue
  // This is a work-around for an issue with React's rehydration function, which
  // does not account for differences in attributes
  // The drawbacks of this approach: the page momentarily renders 
  // a placeholder image and each contest tile component has to be rendered twice
  // This approach was suggested here: https://github.com/gatsbyjs/gatsby/discussions/17914
  // And the problem is explained well here: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => setIsClient(true));

  return (
    <div className="wrapper-sponsor">
      {isClient ? (
        <a href={sponsor.link}>
          <img
            src={sponsor.image.childImageSharp.resize.src}
            alt={sponsor.name}
          />
        </a>
      ) : (
        <div className="placeholder-img"></div>
      )}
    </div>
  );
}

export default SponsorLink;
