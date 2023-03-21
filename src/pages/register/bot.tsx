import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../../hooks/UserContext";

import DefaultLayout from "../../templates/DefaultLayout";

import botPup from "../../../static/images/bot-pup.svg";

export default function UserRegistration({ data }) {
  const [wardens, setWardens] = useState([]);
  const { isInitialized } = useMoralis();
  const { currentUser } = useUser();

  return (
    <DefaultLayout
      pageTitle="Code4rena Bot Races | Code4rena"
      hideConnectWalletDropdown={true}
    >
      <div className="limited-width register-bot type__copy">
        <div className="Form__Form">
          <h1 className="type__headline__page-title">Code4rena Bot Races</h1>
          <section className="register-bot__top-text-container">
            <div className="register-bot__top-text">
              <p>
                Bot Races make AI and automated tools part of the competitive
                audit. Bot Crews compete to see whose bot can create the highest
                quality and most thorough audit report.
              </p>

              <p>
                10% of each contest pool will be dedicated to Bot Race prizes.
              </p>

              <p>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="button button--secondary"
                >
                  More details here ↗
                </a>
              </p>
            </div>
            <img
              src={botPup}
              alt="An illustration of a small, cute robot that has wolf-like features like a snout and ears."
              className="register-bot__top-image"
            />
          </section>
          <section className="register-bot__stage-container">
            <div className="register-bot__stage-one-text">
              <h2>
                <div>Stage 1 </div>Bot Qualifier Race
              </h2>
              <ul>
                <li>
                  Bot Crews race to have their bots deliver the highest quality
                  and most thorough report based on a repo provided at start
                  time.
                </li>
                <li>Bot Qualifier Races are open for one hour.</li>
                <li>
                  Judges choose the Top 20 Bots for upcoming competitions.
                </li>
                <li>We will periodically run new Bot Qualifiers.</li>
              </ul>
            </div>
            <div className="register-bot__stage-two-text">
              <h2>Stage 2: Bot Race</h2>
              <ul>
                <li>
                  The first hour of each audit competition will be dedicated to
                  a Bot Race.
                </li>
                <li>
                  Bot Race submissions will be assessed by Lookouts, and graded
                  A/B/C similarly to other reports based on report quality,
                  validity, and thoroughness.
                </li>
                <li>
                  The best Bot Race report will gain a bonus award of 30%.
                </li>
                <li>
                  The top report will be shared in the competition’s channel and
                  will be considered the official source for known issue
                  submissions.
                </li>
              </ul>
            </div>
          </section>
          <h2>Is your Crew ready to race your bot?</h2>

          <p>Be sure to give it a winning name!</p>

          <section className="register-bot__coming-soon">
            Guess what it's really soon
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
}
