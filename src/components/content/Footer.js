import { Link } from "gatsby";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer limited-width">
      <ul className="footer__items">
        <li className="footer__item">☆ An open organization</li>
        <li className="footer__item">
          <a
            href="https://twitter.com/code4rena"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter (Opens in new Window)"
          >
            Twitter
          </a>
        </li>
        <li className="footer__item">
          <a
            href="https://discord.gg/code4rena"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord (Opens in new Window)"
          >
            Discord
          </a>
        </li>
        <li className="footer__item">
          <a
            href="https://github.com/code-423n4/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub (Opens in new Window)"
          >
            GitHub
          </a>
        </li>
        <li className="footer__item">
          <a
            href="https://medium.com/code4rena"
            target="_blank"
            rel="noreferrer"
            aria-label="Medium (Opens in new Window)"
          >
            Medium
          </a>
        </li>
        <li className="footer__item">
          <Link to="/newsletter-signup">Newsletter</Link>
        </li>
        <li className="footer__item">
          <a
            href="https://github.com/code-423n4/media-kit"
            target="_blank"
            rel="noreferrer"
            aria-label="Media Kit (Opens in new Window)"
          >
            Media kit
          </a>
        </li>

        <li className="footer__item">
          <span className="eth-address">
            <a href="https://etherscan.io/address/0xC2BC2F890067C511215F9463A064221577A53E10">
              code4rena.eth
            </a>
          </span>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
