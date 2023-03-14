import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import useUser from "../../hooks/UserContext";

import DefaultLayout from "../../templates/DefaultLayout";

export default function UserRegistration({ data }) {
  const [wardens, setWardens] = useState([]);
  const { isInitialized } = useMoralis();
  const { currentUser } = useUser();

  return (
    <DefaultLayout
      pageTitle="Code4rena Bot Races | Code4rena"
      hideConnectWalletDropdown={true}
    >
      <div className="limited-width register-bot">
        <div className="Form__Form">
          <h1>Code4rena Bot Races</h1>
          <p>
            A Bot Race is Code4rena’s solution to bring AI and automatic
            detection into the fold, enabling these tools to be a part of the
            overarching security solution. For a more in-depth explanation of
            Code4rena Bot Races, visit this page [LINK to blog].
          </p>
          <h2>Stage 1: Bot Registration</h2>
          <p>
            {" "}
            Once announced, the initial combined registration and application
            period for a Bot Race will be open for one hour. - Judges will parse
            through Bot applications and choose the Top 20 for participation in
            the competition.
          </p>
          <h2>Stage 2: Bot Race</h2>{" "}
          <p>
            At the start of a competition, the first hour will be dedicated to
            the Bot Race. Submissions will be sent to a ‘bot-findings’ repo as
            single reports.{" "}
          </p>
          <h2>Stage 3: Awarding</h2>{" "}
          <p>
            Bot Race submissions will be assessed by Lookouts, and awarded 1st,
            2nd, and 3rd place based on report quality and thoroughness.
          </p>
          <h2>Step 4: Post-awarding</h2>{" "}
          <p>
            The top report will be shared by Lookouts in the competition’s
            channel. This report will be considered the official source for any
            out-of-scope submissions.
          </p>
          <h2>Ready to race your Bot?</h2>
          <button className="button button--primary">CTA</button>
        </div>
      </div>
    </DefaultLayout>
  );
}
