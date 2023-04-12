import React from "react";

const Agreement = () => {
  return (
    <p className="agreement">
      By submitting this form, you agree to abide by the C4{" "}
      <a
        href="https://discord.com/channels/810916927919620096/851883682470166558/851891396255940618"
        target="_blank"
        rel="noreferrer"
        aria-label="Code of conduct. Opens in new window."
      >
        code of conduct
      </a>{" "}
      and{" "}
      <a
        href="https://docs.code4rena.com/roles/wardens/submission-policy"
        target="_blank"
        rel="noreferrer"
        aria-label="Submission policy. Opens in new window."
      >
        submission policy
      </a>
      . If moderators determine you to be in violation of these guidelines, you
      may be subject to consequences which could include a ban or forfeiture of
      awards.
    </p>
  );
};

export default Agreement;
