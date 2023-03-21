import React from "react";

import DefaultLayout from "../templates/DefaultLayout";

export default function HowItWorks(data) {
  return (
    <DefaultLayout bodyClass="landing">
      <div className="type__copy limited-width">
        <h1>How it works</h1>
        <h2>Roles</h2>
        <h3>Warden</h3>: Wardens protect the web3 ecosystem from threats by
        auditing code.
        <h3>Judge</h3>: Judges decide the severity, validity, and quality of
        findings and rate the performance of wardens.
        <h3>Sponsor</h3>: Sponsors create prize pools to attract wardens to
        audit their projects.
        <h3>Scout</h3>: Scouts focus on scoping and pre-competition intel.
        <h3>Lookout</h3>: Lookouts review and organize submissions to
        Code4rena’s competitions, focusing on lightening and clarifying the
        project team’s workload, and preparing the repo for judging.
        <h2>Competition Types</h2>
        <ul>
          <li>
            <h3>Open</h3>This is the standard competitive audit format on
            Code4rena where everyone is allowed to participate and all
            information is open and public.
          </li>
          <li>
            <h3>Classified</h3>
            <p>
              This type of competition is restricted to Wardens who have met the
              conditions of the Code4rena{" "}
              <a href="https://docs.code4rena.com/roles/certified-contributors">
                Certified Contributor
              </a>{" "}
              program. With customizations available for your privacy needs,
              Code4rena can now offer you an audit that is as stealthy as you
              would like.
            </p>
          </li>
          <li>
            <h3>Versus</h3>
            <p>
              Sponsors get the opportunity to work with top Wardens from the
              Code4rena community in a format that best suits their needs. When
              a Versus competition is announced, a limited number of the
              highest-ranking Wardens who RSVP within a 48-hour window can
              participate in the audit.
            </p>
          </li>
          <li>
            <h3>Mitigation review</h3>
            <p>
              Once new code is ready for review after a Code4rena competition,
              the highest-performing Wardens who found the initial
              vulnerabilities are invited to participate in a Mitigation review.
              Insertions, deletions and changes are considered in scope, with
              these Wardens doing another round of auditing to ensure the
              vulnerabilities have been mitigated.
            </p>
          </li>
          <li>
            <h3>Bot Races</h3>
            <p>
              A Bot Race is Code4rena’s solution to bring AI and automatic
              detection into the fold, enabling these tools to be a part of the
              overarching security solution. Bots are registered and used to
              submit findings that can be automatically detected within a
              project’s repo, with the winning report forming the basis for
              out-of-scope submissions for their competition.
            </p>
          </li>
        </ul>
      </div>
    </DefaultLayout>
  );
}
