import React from "react";

const Footer = () => {
  return (
    <footer className="footer limited-width">
      <ul className="footer__items">
        <li className="footer__item">An open organization</li>
        <li className="footer__item">
          <a href="https://twitter.com/code4rena">Twitter</a>
        </li>
        <li className="footer__item">
          <a href="https://discord.gg/code4rena">Discord</a>
        </li>
        <li className="footer__item">
          <a href="https://github.com/code-423n4/">GitHub</a>
        </li>
        <li className="footer__item">
          <span className="eth-address">
            <a href="https://etherscan.io/address/0xC2BC2F890067C511215F9463A064221577A53E10">
              0xC2bc2F890067C511215f9463a064221577a53E10
            </a>
          </span>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
