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
          <h2 className="type__headline__l">
            Projects are already choosing to use Code4rena{" "}
            <span className="no-break">Test Coverage.</span>
          </h2>
          <div className="grid__one-by-two--break-s">
            <div className="">
              <p>
                <strong>Here's why:</strong> Code4rena Test Coverage provides
                projects with surge capacity for their engineering teams
                pre-launch.
              </p>
              <ul>
                <li>Save time</li>
                <li>Save money</li>
                <li>Save effort</li>
              </ul>
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
                  <strong>Step 1</strong>
                </p>{" "}
                The project's engineer will create a GitHub project and outline
                the functions needing test coverage.
              </li>
              <li>
                <p>
                  <strong>Step 2</strong>
                </p>{" "}
                Wardens can review the GitHub project and make suggestions for
                additional tests needed.
              </li>
              <li>
                <p>
                  <strong>Step 3</strong>
                </p>{" "}
                A warden can claim a test coverage ticket, work on it then claim
                another when they complete the first one.
              </li>
            </ul>
          </div>
        </section>
        <section className="tc__section tc__cta limited-width">
          <h2>Get comprehensive test coverage for your project today.</h2>
          <p>
            If you're looking to deploy Code4rena Test Coverage as part of your
            end-to-end security approach, reach out to our team.
          </p>
          <div className="tc__button-holder center--text">
            <button className="button button--primary">Get in touch</button>
            <button className="button button--secondary">Learn more</button>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
