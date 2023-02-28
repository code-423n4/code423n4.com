import React from "react";

const logos = [
  {
    link: "https://opensea.io",
    title: "OpenSea",
    imgSrc: "/images/logos/opensea.svg",
    alt: "OpenSea",
  },
  {
    link: "https://ens.domains",
    title: "ENS",
    imgSrc: "/images/logos/ens.svg",
    alt: "ENS",
  },
  {
    link: "https://aave.com",
    title: "Aave",
    imgSrc: "/images/logos/aave.svg",
    alt: "Aave",
  },
  {
    link: "https://pooltogether.com",
    title: "PoolTogether",
    imgSrc: "/images/logos/pooltogether.svg",
    alt: "PoolTogether",
  },
  {
    link: "https://sushi.com",
    title: "Sushi",
    imgSrc: "/images/logos/sushi.svg",
    alt: "Sushi",
  },
  {
    link: "https://slingshot.finance",
    title: "Slingshot",
    imgSrc: "/images/logos/slingshot.svg",
    alt: "Slingshot",
  },
  {
    link: "https://mechanism.capital",
    title: "Mechanism Capital",
    imgSrc: "/images/logos/mechanism.png",
    alt: "Mechanism Capital",
  },
  {
    link: "https://nascent.xyz",
    title: "Nascent",
    imgSrc: "/images/logos/nascent.svg",
    alt: "Nascent",
  },
  {
    link: "http://www.1kxfoundation.com/",
    title: "1kx",
    imgSrc: "/images/logos/1kx.svg",
    alt: "1kx",
  },
  {
    link: "https://www.connext.network/",
    title: "Connext",
    imgSrc: "/images/logos/connext.svg",
    alt: "Connext",
  },
  {
    link: "https://metacartel.xyz/",
    title: "MetaCartel Venture DAO",
    imgSrc: "/images/logos/metacartel.svg",
    alt: "MetaCartel Venture DAO",
  },
  {
    link: "https://foundation.app/",
    title: "Foundation",
    imgSrc: "/images/logos/foundation.svg",
    alt: "Foundation",
  },
  {
    link: "https://nouns.wtf/",
    title: "NounsDAO",
    imgSrc: "/images/logos/nounsdao.svg",
    alt: "NounsDAO",
  },
  {
    link: "https://www.olympusdao.finance/",
    title: "OlympusDAO",
    imgSrc: "/images/logos/olympusdao.svg",
    alt: "OlympusDAO",
  },
  {
    link: "https://juicebox.money/",
    title: "JuiceBox",
    imgSrc: "/images/logos/juicebox.svg",
    alt: "JuiceBox",
  },
  {
    link: "https://tally.cash",
    title: "Tally Wallet",
    imgSrc: "/images/logos/tally.svg",
    alt: "Tally Wallet",
  },
  {
    link: "https://alchemix.fi",
    title: "Alchemix",
    imgSrc: "/images/logos/alchemix.svg",
    alt: "Alchemix",
  },
  {
    link: "https://frax.finance/",
    title: "Frax Finance",
    imgSrc: "/images/logos/fraxfinance.svg",
    alt: "Frax Finance",
  },
  {
    link: "https://unlock-protocol.com/",
    title: "Unlock Protocol",
    imgSrc: "/images/logos/unlock.svg",
    alt: "Unlock",
  },
  {
    link: "https://maple.finance/",
    title: "Maple Finance",
    imgSrc: "/images/logos/maple.svg",
    alt: "Maple Finance",
  },
  {
    link: "https://elasticswap.org",
    title: "Elastic Swap",
    imgSrc: "/images/logos/elasticswap.svg",
    alt: "Elastic Swap",
  },
  {
    link: "https://www.gravitybridge.net/",
    title: "Gravity Bridge",
    imgSrc: "/images/logos/gravity-bridge.svg",
    alt: "Gravity Bridge",
  },
  {
    link: "https://www.yield.app/",
    title: "Yield",
    imgSrc: "/images/logos/yield.svg",
    alt: "Yield",
  },
  {
    link: "https://www.forgottenrunes.com/",
    title: "Forgotten Runes",
    imgSrc: "/images/logos/forgotten-runes.svg",
    alt: "Forgotten Runes",
  },
];
const TrustBar = () => (
  <div className="trustbar">
    <div className="limited-width">
      <h2 className="type__headline__m">
        Leading crypto projects choose Code4rena
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
