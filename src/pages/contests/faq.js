import React from "react";

const ContestFAQ = (props) => {
  return (
    <>
      <h1>Contests FAQ</h1>
      <h2>Contents</h2>
      <ul>
        <li>
          <a href="#project-token-awards">Project Token Awards</a>
        </li>
      </ul>
      <h1 name="project-token-awards">Project Token Awards</h1>
      <ul class="faq-question-list">
        <li>
          <h2>How are the project token award distributions calculated?</h2>
          <p>
            We market award pools using USD value. The exchange rate between a
            project token award and USD is the spot value when the contest
            sponsor transfers the tokens to the C4 wallet. The resulting token
            quantity is what we plug in to our awarding algorithm [note: maybe
            link to this?] at the time of award distribution. We do not adjust
            project token quantities after C4 has received them from the contest
            sponsor.
          </p>
        </li>
        <li>
          <h2>
            What if the token value goes up/down compared to USD between the
            time the sponsor pays and when C4 distributes awards?
          </h2>
          <p>
            Project tokens generally have more volatility compared to ETH, thus
            why we generally only allow project tokens as a “bonus pool” for a
            contest. In addition to financial value, we believe project tokens
            also provide alignment between your work as a warden and the
            project’s success. As to the volatility of such tokens, we believe a
            regular participant would see a smoothed value of their total
            project token holdings compared to USD over time. Some will go up,
            some will go down.
          </p>
        </li>
        <li>
          <h2>When are project token awards distributed?</h2>
          <p>
            Our goal is to distribute them at the same time as the main award
            pool. The exception to this is if the project token does not yet
            exist.
          </p>
        </li>
        <li>
          <h2>
            What about project token award pools with tokens that do not yet
            exist?
          </h2>
          <p>
            Some contest sponsors may choose to offer their not-yet-launched
            project token in an award pool for their contest. C4 remains in
            close contact with such sponsors in order to receive the appropriate
            project token payment as soon as the token is available. The timing
            of this depends on the project and their launch, but it may be weeks
            later than the ETH/stablecoin award. [might need to check this to
            make sure we’re getting fair value?]
          </p>
        </li>
        <li>
          <h2>What about all-token award pools?</h2>
          <p>
            At the time of writing (Nov 2021), we’ve had one sponsor put up
            all-project-token award pools, Sushi. We believe this sort of award
            structure will be the exception, rather than the rule, and we have
            an extremely high bar for allowing projects to do this. A primary
            goal of C4 is to ensure that wardens receive fair value for their
            work.
          </p>
        </li>
      </ul>
    </>
  );
};

export default ContestFAQ;
