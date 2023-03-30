import React from "react";

import DefaultLayout from "../../templates/DefaultLayout";

export default function BotRegistration() {
  return (
    <DefaultLayout
      pageTitle="Code4rena Bot Races | Code4rena"
      hideConnectWalletDropdown={true}
    >
      <div className="register-bot type__copy">
        {/* Hero */}
        <section className="register-bot__hero">
          <div className="register-bot__hero-content limited-width">
            <h1 className="type__headline__page-title">
              Gentlefrens, start your engines
            </h1>
            <h2 className="type__subline__page-title">
              Coordinating AI and human efforts to provide the most
              comprehensive vulnerability reports for{" "}
              <span className="no-break">web3 projects</span>.
            </h2>
          </div>
          <div className="waves-wrapper">
            <img
              src="/images/br-hero-waves.svg"
              className="waves"
              alt="Vector illustration of a series of playful robots racing"
            />
          </div>
          <div className="register-bot__hero-ground"></div>
          <div className="register-bot__hero-countdown">
            Bot Qualifier Race starts in early April
          </div>
        </section>

        {/* What's a bot race */}
        <section className="register-bot__top-text-container limited-width">
          <h2 className="register-bot__sub-header type__headline__xl">
            What's a bot race?
          </h2>
          <div className="register-bot__top-text grid__one-by-two--break-m">
            <p>
              <img
                src="/images/br-icon-bot.svg"
                alt="Icon of a round, floating robot"
              />
              <strong>Bot Races</strong> make AI and automated tools part of the
              competitive audit.
            </p>
            <p>
              <img
                src="/images/br-icon-report.svg"
                alt="Icon of a wolf-like robot head printing a report out of its mouth"
              />
              <strong>Bot Crews</strong> compete to see whose bot can create the
              highest quality and most thorough audit report.
            </p>

            <p>
              <img
                src="/images/br-icon-coins.svg"
                alt="Icon of two stacks of coins that are shining"
              />
              <strong>10%</strong> of each contest pool will be dedicated to Bot
              Race prizes.
            </p>
          </div>
        </section>

        {/* Stages / Timeline */}
        <section className="register-bot__stage-container limited-width">
          <h2 className="register-bot__sub-header type__headline__xl">
            How do Bot Races work?
          </h2>
          <div className="register-bot__stage-one">
            <h3>
              <div className="register-bot__header-stage-number">Stage 1 </div>
              <div className="register-bot__header-stage-name">
                Bot Qualifier Race
              </div>
            </h3>
            <div className="register-bot__text">
              <p className="register-bot__timeline-time">Early April</p>
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
          </div>

          <div className="register-bot__stage-two">
            <h3>
              <div className="register-bot__header-stage-number">Stage 2</div>
              <div className="register-bot__header-stage-name">Bot Race</div>
            </h3>
            <div className="register-bot__text">
              <p className="register-bot__timeline-time">
                Date to be announced
              </p>
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
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="register-bot__bottom-cta">
          <div className="limited-width">
            <img
              src="/images/bot-pup.svg"
              alt="An illustration of a small, cute robot that has wolf-like features like a snout and ears."
              className="register-bot__bot-image"
            />
            <h2 className="register-bot__sub-header type__headline__xl">
              Is your Crew ready to race{" "}
              <span className="no-break">your bot?</span>
            </h2>
            <h3 className="type__headline__m">
              Be sure to give it a winning name!
            </h3>
            <p className="register-bot__coming-soon">
              Bot Qualifier Race coming in early April
            </p>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
