import React from "react";

import DefaultLayout from "../templates/DefaultLayout";
import { Link } from "gatsby";

export default function HowItWorks(data) {
  return (
    <DefaultLayout>
      <section className="tc__hero type__copy">
        <div className="limited-width">
          <h1 className="type__headline__landing-hero">
            Test coverage, solved.
          </h1>
          <h2 className="type__subline__landing-hero">
            Saving your project time, money, and effort with the help of our
            web3 smart <span className="no-break">contract experts</span>.
          </h2>
          <div className="tc__hero-image">
            <img src="/images/tc-hero.svg" alt="Test Coverage Hero Image" />
          </div>
        </div>
      </section>
      <div className="type__copy">
        <section className="tc__section limited-width tc__why">
          <h2>
            Projects are already choosing Code4rena{" "}
            <span className="no-break">Test Coverage.</span>
          </h2>
          <p className="text">
            Here’s why:{" "}
            <a
              href="https://medium.com/code4rena/new-to-code4rena-test-coverage-c548645404f9"
              rel="noreferrer"
              target="_blank"
            >
              {" "}
              Code4rena Test Coverage
            </a>{" "}
            empowers projects to meet all of their priorities without
            compromise, by providing projects with surge capacity for their
            engineering teams pre-launch.
          </p>
          <div className="grid__one-by-two--break-m">
            <div className="tc__saves-section">
              <h3>Save time. </h3>
              <p>
                With the added capacity provided by Test Coverage Wardens, test
                coverage can be completed in just a matter of days, saving your
                team precious time.
              </p>
              <h3>Save money. </h3>
              <p>
                {" "}
                By utilizing Code4rena Test Coverage, your project can save
                money that would have been spent on hiring freelancers to
                complete test coverage.
              </p>
              <h3>Ensure quality. </h3>
              <p>
                You’re empowered to ship code that has been thoroughly tested by
                security-minded experts, allowing your team to stay focused on
                the things that only they can do.
              </p>
            </div>
            <div className="tc__screens">
              <img
                src="/images/tc-screens.svg"
                alt="Cartoonized computer screens"
              />
            </div>
          </div>
        </section>
        <section className="tc__section tc__steps">
          <div className="limited-width">
            <h2>
              How does Code4rena Test{" "}
              <span className="no-break">Coverage work?</span>
            </h2>
            <ul className="grid__one-by-three--break-m">
              <li>
                <p>
                  <h3>Step 1</h3>
                </p>{" "}
                The project’s engineer creates a GitHub project and outlines the
                functions needing test coverage.
              </li>
              <li>
                <p>
                  <h3>Step 2</h3>
                </p>{" "}
                Wardens review the GitHub project and make suggestions for
                additional tests needed.
              </li>
              <li>
                <p>
                  <h3>Step 3</h3>
                </p>{" "}
                Wardens claim test coverage tickets, work on them, then claim
                another when they complete the first one.
              </li>
            </ul>
          </div>
        </section>
        <section className="tc__section tc__cta limited-width">
          <h2>Get comprehensive test coverage for your project today.</h2>
          <p className="center--text">
            We’re here to help you get the highest quality result in the
            shortest amount of time, without compromising on time, money,
            effort, or security. If you’re looking to deploy Code4rena Test
            Coverage as part of your end-to-end secure launch approach, reach
            out to our team.
          </p>
          <div className="tc__button-holder center--text">
            <a
              href="https://t.me/trebienxyz"
              rel="noreferrer"
              target="_blank"
              className="button button--primary"
            >
              Contact us
            </a>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
