import React from "react";

const ContestFAQ = (props) => {
  return (
    <div className="faq-tab-content">
      <h1 className="header-context" id="faq-tab-content-for-website">
        C4 Competition FAQ
      </h1>
      <p>
        All links sourced from:{" "}
        <a href="https://docs.code4rena.com/">https://docs.code4rena.com/</a>
      </p>
      <h2 id="what-is-c4-">What is C4?</h2>
      <ul>
        <li>
          <a href="https://docs.code4rena.com/">
            I&#39;m brand new here. What do I need to know?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/#bug-bounties-vs-c4-audit-contests">
            So is this a bug bounty?
          </a>
        </li>
      </ul>
      <h2 id="how-do-the-contests-work-">How do the contests work?</h2>
      <ul>
        <li>
          <a href="https://docs.code4rena.com/#incentive-model-and-awards">
            How does scoring/awarding work?
          </a>
          <ul>
            <li>
              <a href="https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr">
                How are the risk categories determined?
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens#joining-a-contest">
            How do I become a warden?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens/judging-criteria">
            What are the judging criteria?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens/judging-criteria#duplicate-submissions">
            What happens if multiple wardens submit the same bug?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens/submission-policy#submitting-a-report">
            What are the guidelines for submitting a report?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens/submission-policy#withdrawing-a-report">
            Can I withdraw a report after submitting it?
          </a>
        </li>
        <li>
          <a href="https://docs.code4rena.com/structure/our-process">
            When can I expect [awards to be announced / reports to be published
            / etc.]?
          </a>
        </li>
      </ul>
      <h2 id="learning-resources">Learning resources</h2>
      <ul>
        <li>
          <a href="https://docs.code4rena.com/roles/wardens/tools-and-resources">
            I want to learn more about security research, auditing, etc. — any
            recommendations?
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContestFAQ;
