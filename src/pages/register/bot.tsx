import { graphql, Link } from "gatsby";
import React, { useCallback, useState } from "react";
import { format } from "date-fns";

import botRaceQualifier from "../../../_data/bot-race-qualifier.json";
import useUser from "../../hooks/UserContext";
import { ContestStatus, getDates } from "../../utils/time";

import DefaultLayout from "../../templates/DefaultLayout";
import BotRegistrationForm from "../../components/BotRegistrationForm";
import { WardenFieldOption } from "../../components/reporter/widgets/WardenField";
import ProtectedSection from "../../components/ProtectedSection";
import Countdown from "../../components/Countdown";

// @todo: automate this based on contest data for future bot races
// keep in sync with nextBotQualifier from config file
const START = botRaceQualifier.start;
const END = botRaceQualifier.end;
const REPO = botRaceQualifier.repo;

function getRegistrationWindowStatus(): ContestStatus {
  const contestTimeline = getDates(START, END);
  return contestTimeline.botRaceStatus;
}

export default function BotRegistration({ data }) {
  const { currentUser } = useUser();
  const [
    registrationWindowStatus,
    setRegistrationWindowStatus,
  ] = useState<ContestStatus>(getRegistrationWindowStatus());

  const handles: Set<string> = new Set([
    ...data.handles.edges.map((h) => h.node.handle),
    ...data.bots.edges.map((b) => b.node.handle),
  ]);

  let wardens: WardenFieldOption[] = [];
  data.handles.edges.forEach(({ node }) => {
    if (!node.members) {
      wardens.push({ value: node.handle, image: node.image });
    }
  });

  const updateContestStatus = useCallback(() => {
    setRegistrationWindowStatus(getRegistrationWindowStatus());
  }, [registrationWindowStatus]);

  return (
    <DefaultLayout pageTitle="Code4rena Bot Races | Code4rena">
      <div className="register-bot">
        {/* Hero */}
        <section className="register-bot__hero type__copy">
          <div className="register-bot__hero-content limited-width">
            <h1 className="type__headline__landing-hero">
              Gentlefrens, start your engines.
            </h1>
            <h2 className="type__subline__landing-hero">
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
            {registrationWindowStatus === ContestStatus.Live && (
              <Countdown
                text="Bot Race Qualifier is live! Ends in: "
                start={START}
                end={END}
                isPreview={false}
                updateContestStatus={updateContestStatus}
              />
            )}
            {registrationWindowStatus === ContestStatus.Done && (
              <>
                Keep your eye on our Announcements channel in{" "}
                <a
                  href="https://discord.gg/code4rena"
                  rel="noreferrer"
                  aria-label="Discord announcements channel (Opens in a new window)"
                >
                  Discord
                </a>{" "}
                to find out when the next one will be.
              </>
            )}
            {registrationWindowStatus === ContestStatus.Soon && (
              <Countdown
                text="Bot Race Qualifier starts in: "
                start={START}
                end={END}
                isPreview={false}
                updateContestStatus={updateContestStatus}
              />
            )}
          </div>
        </section>

        {/* What's a bot race */}
        <section className="register-bot__top-text-container limited-width type__copy">
          <h2 className="register-bot__sub-header type__headline__xl">
            What's a Bot Race?
          </h2>
          <div className="register-bot__top-text grid__one-by-two--break-m">
            <p>
              <img
                src="/images/br-icon-bot.svg"
                alt="Icon of a round, floating robot"
              />
              <strong>Bot Races</strong> make AI and automated tools the first
              phase of the competitive audit.
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
        <section className="register-bot__stage-container limited-width type__copy">
          <h2 className="register-bot__sub-header type__headline__xl">
            How do Bot Races work?
          </h2>
          <div className="register-bot__stage-one">
            <h3>
              <div className="register-bot__header-stage-number">Stage 1 </div>
              <div className="register-bot__header-stage-name">
                Qualifier Race
              </div>
            </h3>
            <div className="register-bot__text">
              <p className="register-bot__timeline-time">
                Starting Early April
              </p>
              <ul>
                <li>
                  Bot Crews race to have their bots deliver the highest quality
                  and most thorough report based on a repo provided at start
                  time.
                </li>
                <li>Qualifier Races are open for one hour.</li>
                <li>
                  Judges choose the Top 20 Bots for upcoming competitions.
                </li>
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
                Starting 27 April 2023
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
                  The best Bot Race report will receive a 30% share bonus.
                </li>
                <li>
                  The top report will be shared in the competition’s channel and
                  will be considered the official source for known issue
                  submissions.
                </li>
              </ul>
            </div>
          </div>

          <div className="register-bot__learn-more center--flex">
            <a
              href="https://medium.com/code4rena/new-to-code4rena-bot-races-91b8f4ca0b18"
              target="_blank"
              rel="noreferrer"
              className="button button--primary"
            >
              Learn more about Bot Races
            </a>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="register-bot__bottom-cta type__copy limited-width">
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
        </section>
        <div className="limited-width register-bot__register-wrapper">
          {registrationWindowStatus === ContestStatus.Live && (
            <section className="register-bot__register register-bot__register--open">
              <ProtectedSection message="To register a bot for Bot Races, you need to be a registered warden, currently connected via wallet.">
                {!currentUser.bot || currentUser.bot.relegated ? (
                  <BotRegistrationForm handles={handles} wardens={wardens}>
                    <div className="register-bot__repo-link-wrapper">
                      <img
                        src="/images/br-icon-report.svg"
                        alt="Icon of a wolf-like robot head being fed lots of paper"
                      />
                      <div className="register-bot__repo-link">
                        <h2 className="type__headline__xxs">
                          Feed this codebase to your bot:{" "}
                        </h2>
                        <a
                          href={REPO}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Link to the contest repo (Opens in a new window)"
                        >
                          {REPO.replace("https://github.com/code-423n4/", "")}
                        </a>
                      </div>
                    </div>
                    <Countdown
                      text="Ends in: "
                      start={START}
                      end={END}
                      isPreview={false}
                      updateContestStatus={updateContestStatus}
                    />
                  </BotRegistrationForm>
                ) : (
                  <p className="type__copy">
                    Your bot, {currentUser.bot.username}, is registered! Check
                    the <Link to="/contests">Competitions page</Link> for
                    contests with bot races.
                  </p>
                )}
              </ProtectedSection>
            </section>
          )}
          {registrationWindowStatus === ContestStatus.Done && (
            <section className="register-bot__register register-bot__register--closed type__copy">
              <h1 className="spacing-bottom__l">Bot Registration is closed</h1>
              <p>
                The Bot Race qualifier window is currently closed.
                <br />
                Keep your eye on our Announcements channel in{" "}
                <a
                  href="https://discord.gg/code4rena"
                  rel="noreferrer"
                  aria-label="Discord announcements channel (Opens in a new window)"
                >
                  Discord
                </a>{" "}
                to find out when the next one will be.
              </p>
            </section>
          )}
          {registrationWindowStatus === ContestStatus.Soon && (
            <section className="register-bot__register register-bot__register--soon type__copy">
              <h1>Next Qualifier Coming Soon...</h1>
              <Countdown
                text="Starts in: "
                start={START}
                end={END}
                isPreview={false}
                updateContestStatus={updateContestStatus}
              />
              <p>
                The next qualifier for Bot Races will open for one hour on{" "}
                {format(new Date(START), "d MMMM")} from{" "}
                {format(new Date(START), "h:mm a")} to{" "}
                {format(new Date(END), "h:mm a O")}
              </p>
            </section>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    handles: allHandlesJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
          image {
            childImageSharp {
              resize(width: 80) {
                src
              }
            }
          }
        }
      }
    }
    bots: allBotsJson(sort: { fields: handle, order: ASC }) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
