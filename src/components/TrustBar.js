import React from "react";

const logos = [
  {
    title: "OpenSea",
    imgSrc: "/images/logos/opensea.svg",
    alt: "OpenSea",
  },
  {
    title: "ENS",
    imgSrc: "/images/logos/ens.svg",
    alt: "ENS",
  },
  {
    title: "Aave",
    imgSrc: "/images/logos/aave.svg",
    alt: "Aave",
  },
  {
    title: "PoolTogether",
    imgSrc: "/images/logos/pooltogether.svg",
    alt: "PoolTogether",
  },
  {
    title: "Sushi",
    imgSrc: "/images/logos/sushi.svg",
    alt: "Sushi",
  },
  {
    title: "Slingshot",
    imgSrc: "/images/logos/slingshot.svg",
    alt: "Slingshot",
  },
  {
    title: "Mechanism Capital",
    imgSrc: "/images/logos/mechanism.png",
    alt: "Mechanism Capital",
  },
  {
    title: "Tally Wallet",
    imgSrc: "/images/logos/tally.svg",
    alt: "Tally Wallet",
  },
  {
    title: "Nascent",
    imgSrc: "/images/logos/nascent.svg",
    alt: "Nascent",
  },
  {
    title: "1kx",
    imgSrc: "/images/logos/1kx.svg",
    alt: "1kx",
  },
  {
    title: "Connext",
    imgSrc: "/images/logos/connext.svg",
    alt: "Connext",
  },
  {
    title: "MetaCartel Venture DAO",
    imgSrc: "/images/logos/metacartel.svg",
    alt: "MetaCartel Venture DAO",
  },
  {
    title: "Foundation",
    imgSrc: "/images/logos/foundation.svg",
    alt: "Foundation",
  },
  {
    title: "NounsDAO",
    imgSrc: "/images/logos/nounsdao.svg",
    alt: "NounsDAO",
  },
  {
    title: "OlympusDAO",
    imgSrc: "/images/logos/olympusdao.svg",
    alt: "OlympusDAO",
  },
  {
    title: "JuiceBox",
    imgSrc: "/images/logos/juicebox.svg",
    alt: "JuiceBox",
  },
  {
    title: "Alchemix",
    imgSrc: "/images/logos/alchemix.svg",
    alt: "Alchemix",
  },
  {
    title: "Frax Finance",
    imgSrc: "/images/logos/fraxfinance.svg",
    alt: "Frax Finance",
  },
  {
    title: "Unlock Protocol",
    imgSrc: "/images/logos/unlock.svg",
    alt: "Unlock",
  },
  {
    title: "Maple Finance",
    imgSrc: "/images/logos/maple.svg",
    alt: "Maple Finance",
  },
  {
    title: "Elastic Swap",
    imgSrc: "/images/logos/elasticswap.svg",
    alt: "Elastic Swap",
  },
  {
    title: "Gravity Bridge",
    imgSrc: "/images/logos/gravity-bridge.svg",
    alt: "Gravity Bridge",
  },
  {
    title: "Yield",
    imgSrc: "/images/logos/yield.svg",
    alt: "Yield",
  },
  {
    title: "Forgotten Runes",
    imgSrc: "/images/logos/forgotten-runes.svg",
    alt: "Forgotten Runes",
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
          <a
            href={logo.link}
            title={logo.title}
            key={logo.link}
            target="_blank"
            rel="noreferrer"
            className="trustbar__logo"
          >
            <img src={logo.imgSrc} alt={logo.alt} />
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default TrustBar;
