import React from "react";

const logos = [
  {
    title: "ENS",
    imgSrc: "/images/logos/ens-logo-full.svg",
    alt: "ENS",
  },
  {
    title: "OpenSea",
    imgSrc: "/images/logos/opensea.svg",
    alt: "OpenSea",
  },
  {
    title: "NounsDAO",
    imgSrc: "/images/logos/nouns-logo-full.svg",
    alt: "NounsDAO",
  },
  {
    title: "The Graph",
    imgSrc: "/images/logos/the-graph-logo-full.svg",
    alt: "The Graph",
  },
  {
    title: "Blur",
    imgSrc: "/images/logos/blur-logo-full.svg",
    alt: "Blur",
  },
  {
    title: "Chainlink",
    imgSrc: "/images/logos/chainlink-logo-full.svg",
    alt: "Chainlink",
  },
  {
    title: "ZkSync",
    imgSrc: "/images/logos/zksync-logo-full.svg",
    alt: "ZKSync",
  },
  {
    title: "Aave",
    imgSrc: "/images/logos/aave.svg",
    alt: "Aave",
  },
  {
    title: "Trader Joe",
    imgSrc: "/images/logos/trader-joe-plaintext-logo.svg",
    alt: "Trader Joe",
  },
  {
    title: "PoolTogether",
    imgSrc: "/images/logos/pooltogether.svg",
    alt: "PoolTogether",
  },
  {
    title: "Sushi",
    imgSrc: "/images/logos/sushi-logo-full.svg",
    alt: "Sushi",
  },
  {
    title: "JuiceBox",
    imgSrc: "/images/logos/juicebox-logo-full.svg",
    alt: "JuiceBox",
  },
  {
    title: "Tessera",
    imgSrc: "/images/logos/tessera-logo-full.svg",
    alt: "Tessera",
  },
  {
    title: "Yield",
    imgSrc: "/images/logos/yield-protocol-logo-full.svg",
    alt: "Yield",
  },
  {
    title: "Foundation",
    imgSrc: "/images/logos/foundation.svg",
    alt: "Foundation",
  },
];
const TrustBar = () => (
  <div className="trustbar" data-nosnippet>
    <div className="limited-width">
      <h2 className="type__headline__m">
        Leading crypto projects choose Code4rena.
      </h2>
      <p className="type__subline__s">There's a reason why.</p>
      <div className="trustbar__logos">
        {logos.map((logo) => (
          <img
            src={logo.imgSrc}
            alt={logo.alt + " logo"}
            className="trustbar__logo"
          />
        ))}
      </div>
    </div>
  </div>
);

export default TrustBar;
