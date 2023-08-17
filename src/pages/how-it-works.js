import React from "react";

import DefaultLayout from "../templates/DefaultLayout";
import { Link } from "gatsby";

export default function HowItWorks(data) {
  return (
    <DefaultLayout bodyClass="landing">
      <div className="type__copy limited-width how-it-works">
        <h1 className="spacing-bottom__xxl">How it works</h1>

        {/* Roles */}
        <h2 className="spacing-bottom__xl">Roles</h2>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Warden</h3>
          <p>
            Wardens protect the web3 ecosystem from threats by auditing code.
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Judge</h3>
          <p>
            Judges decide the severity, validity, and quality of findings and
            rate the performance of wardens.
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Sponsor</h3>
          <p>
            Sponsors create prize pools to attract wardens to audit their
            projects.
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Scout</h3>
          <p>Scouts focus on scoping and pre-audit intel.</p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Lookout</h3>
          <p>Lookouts review and organize submissions to Code4rena’s audits.</p>
        </section>

        {/* Audit Types */}
        <h2 className="spacing-top__xxl spacing-bottom__xl">Audit Types</h2>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Open</h3>
          <p>
            This is the standard competitive audit format on Code4rena where
            everyone is invited to participate and all information is open and
            public.
          </p>
          <p>
            <a
              href="https://medium.com/code-423n4/a-look-at-code4rena-audits-open-1a8e74e558c8"
              className="button button--text-link"
            >
              Learn more about open competitions
            </a>
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Private</h3>
          <p>
            This type of audit is restricted to Wardens who have met the
            conditions of the Code4rena{" "}
            <a href="https://docs.code4rena.com/roles/certified-contributors">
              Certified Contributor
            </a>{" "}
            program, which includes a Non-Disclosure Agreement. With
            customizations available for your privacy needs, Code4rena can offer
            you an audit that is as stealthy as you’d like.
          </p>
          <p>
            <a
              href="https://medium.com/code4rena/a-look-at-code4rena-audits-classified-3ee3cbe87617"
              className="button button--text-link"
            >
              Learn more about Private audits
            </a>
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Invitational</h3>
          <p>
            Sponsors get the opportunity to work with top Wardens from the
            Code4rena community in a format that best suits their needs. When an
            Invitational audit is announced, a limited number of the
            highest-ranking Wardens who RSVP within a 48-hour window can
            participate in the audit.
          </p>
          <p>
            <a
              href="https://medium.com/code4rena/a-look-at-code4rena-audits-versus-6c55d57939ef"
              className="button button--text-link"
            >
              Learn more about Invitational audits
            </a>
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Mitigation review</h3>
          <p>
            Once new code is ready for review after a Code4rena audit, the
            highest-performing Wardens who found the initial vulnerabilities are
            invited to participate in a Mitigation review. Insertions, deletions
            and changes are considered in scope, with these Wardens doing
            another pass to confirm these amendments and suitable and/or find
            any newly introduced vulnerabilities.
          </p>
          <p>
            <a
              href="https://medium.com/code4rena/a-look-at-code4rena-audits-mitigation-review-3e05f8b7acb7"
              className="button button--text-link"
            >
              Learn more about Mitigation reviews
            </a>
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Bot Races</h3>
          <p>
            Bot Races make AI and automated tools part of the competitive audit.
            Bots are registered and used to submit findings that can be
            automatically detected in a project’s code, with the winning report
            serving as a resource for all auditors and forming the basis for
            known issues for the audit.
          </p>
          <p>
            <Link to="/register/bot" className="button button--text-link">
              Learn more about Bot Races
            </Link>
          </p>
        </section>
        <section className="how-it-works__section">
          <h3 className="type__headline__s">Test Coverage</h3>
          <p>
            Code4rena Test Coverage empowers projects to meet all of their
            priorities without compromise, by providing projects with surge
            capacity for their engineering teams pre-launch. Ship quality code
            that has been thoroughly tested by our community of security-minded
            experts, at an accelerated rate.
          </p>
          <p>
            <Link to="/test-coverage" className="button button--text-link">
              Learn more about Test Coverage
            </Link>
          </p>
        </section>
      </div>
    </DefaultLayout>
  );
}
