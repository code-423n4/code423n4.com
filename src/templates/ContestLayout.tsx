import clsx from "clsx";
import { graphql, Link } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// types
import { WardenFindingsForContest } from "../../types/finding";
// helpers
import { getDates } from "../utils/time";
// hooks
import useUser from "../hooks/UserContext";
// components
import ClientOnly from "../components/ClientOnly";
import Countdown from "../components/Countdown";
import DefaultLayout from "./DefaultLayout";
import FindingsList from "../components/FindingsList";
import LeaderboardTableReduced from "../components/LeaderboardTableReduced";
import WardenDetails from "../components/WardenDetails";
import ReactMarkdown from "react-markdown";

enum FindingsStatus {
  Fetching = "fetching",
  Error = "error",
  Success = "success",
}

const ContestLayout = ({ data }) => {
  // state
  const [artOpen, setArtOpen] = useState(false);
  const [findingsList, setFindingsList] = useState<WardenFindingsForContest>({
    user: [],
    teams: {},
  });
  const [findingsStatus, setFindingsStatus] = useState<FindingsStatus>(
    FindingsStatus.Fetching
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [canViewContest, setCanViewContest] = useState<boolean>(false);
  const [leaderboardResults, setLeaderboardResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // hooks
  const { currentUser } = useUser();

  const {
    title,
    sponsor,
    details,
    amount,
    repo,
    findingsRepo,
    fields,
    start_time,
    end_time,
    contestid,
  } = data.contestsCsv;

  const { markdownRemark } = data;

  const t = getDates(start_time, end_time);
  const dateDescription = `${amount}\n${t.startDay}—${t.endDay}`;
  const pageTitle = `Code4rena ${title}`;

  const canViewReport = Boolean(markdownRemark && markdownRemark.frontmatter);
  let reportUrl = "";
  if (canViewReport) {
    reportUrl = markdownRemark.frontmatter.altUrl
      ? markdownRemark.frontmatter.altUrl
      : `/reports/${data.markdownRemark.frontmatter.slug}`;
  }

  const statusText = {
    active: "Live",
    soon: "Coming Soon",
    completed: "Ended",
  };

  useEffect(() => {
    (async () => {
      if (fields.codeAccess === "public") {
        setCanViewContest(true);
      } else if (fields.codeAccess === "certified" && currentUser.isCertified) {
        setCanViewContest(true);
      } else {
        setCanViewContest(false);
      }
      if (currentUser.isLoggedIn) {
        const user = Moralis.User.current();
        const sessionToken = user?.attributes.sessionToken;

        try {
          const response = await fetch(
            `/.netlify/functions/manage-findings?contest=${contestid}`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${sessionToken}`,
                "C4-User": currentUser.username,
              },
            }
          );

          if (!response.ok) {
            const { error } = await response.json();
            setFindingsStatus(FindingsStatus.Error);
            setErrorMessage(error);
            return;
          }
          const resultData: WardenFindingsForContest = await response.json();

          setFindingsList(resultData);
          setFindingsStatus(FindingsStatus.Success);
        } catch (error) {
          setFindingsStatus(FindingsStatus.Error);
        }
      } else {
        setFindingsList({ user: [], teams: {} });
      }
    })();
  }, [currentUser, contestid, fields]);

  // get contest leaderboard results
  useEffect(() => {
    (async () => {
      const result = await fetch(
        `/.netlify/functions/leaderboard?contest=${contestid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ node: data.contestsCsv }]),
        }
      );
      if (result.ok) {
        setLeaderboardResults(await result.json());
      } else {
        // @TODO: what to do here?
        throw "Unable to fetch leaderboard results.";
      }
      setIsLoading(false);
    })();
  }, [contestid]);

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="contest-page"
      preview={fields.artPath} // TODO: Are we still using this
      pageDescription={dateDescription}
    >
      <div className="">
        <ClientOnly>
          <section className="contest-page__top limited-width">
            {t.contestStatus === "soon" || t.contestStatus === "active" ? (
              <div className="contest-page__top-bar">
                <span
                  className={
                    "contest-tile__status-indicator-text contest-tile__status-indicator-text--" +
                    t.contestStatus
                  }
                >
                  {statusText[t.contestStatus]}
                </span>
                <span className="contest-tile__countdown">
                  {t.contestStatus === "soon" ? "Starts in:" : "Ends in:"}
                  <Countdown
                    start={start_time}
                    end={end_time}
                    isPreview={findingsRepo === ""}
                  />
                </span>
              </div>
            ) : null}

            <div className="contest-page__top-content">
              <div className="contest-page__project">
                <div className="contest-page__project-link project-link">
                  <a href={sponsor.link}>
                    <img
                      src={sponsor.image.childImageSharp.resize.src}
                      alt={sponsor.name}
                      width="90px"
                      height="90px"
                    />
                  </a>
                </div>
                <div>
                  <h1 className="type__headline__xs">{title}</h1>
                  <p>{details}</p>
                  {contestid === 231 && (
                    <p>
                      <span className="competition-tag--blurple">
                        Bot Race Qualifier
                      </span>
                      <Link
                        to="/register/bot"
                        className="button button--text-link"
                      >
                        Register your bot
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              <div className="contest-page__button-wrapper">
                {t.contestStatus !== "soon" && canViewContest && (
                  <a href={repo} className="button button--primary">
                    View Repo
                  </a>
                )}

                {t.contestStatus === "active" &&
                  findingsRepo &&
                  fields.submissionPath &&
                  canViewContest && (
                    <Link
                      to={fields.submissionPath}
                      className="button button--secondary"
                    >
                      Submit Finding
                    </Link>
                  )}
                {canViewReport && (
                  <Link to={reportUrl} className="button button--secondary">
                    View Report
                  </Link>
                )}
              </div>
            </div>
            <ul className="contest-page__details-grid">
              <li className="contest-page__start-date">
                <span className="contest-page__grid-label">Start Date</span>
                <span className="contest-page__grid-value type__headline__xs">
                  {t.startDay}
                </span>
              </li>
              <li className="contest-page__end-date">
                <span className="contest-page__grid-label">End Date</span>
                <span className="contest-page__grid-value type__headline__xs">
                  {t.endDay}
                </span>
              </li>
              <li className="contest-page__amount">
                <span className="contest-page__grid-label">Total Awards</span>
                <span className="contest-page__grid-value type__headline__xs">
                  {amount}
                </span>
              </li>
              <li className="contest-page__duration">
                <span className="contest-page__grid-label">Duration</span>
                <span className="contest-page__grid-value type__headline__xs">
                  {t.daysDuration} days
                </span>
              </li>
            </ul>
          </section>
          <Tabs className="contest-page__tabs">
            <TabList className="limited-width secondary-nav">
              {t.contestStatus === "completed" && (
                <Tab className="secondary-nav__item">Results</Tab>
              )}
              <Tab className="secondary-nav__item">Details</Tab>
              {t.contestStatus === "active" && (
                <Tab className="secondary-nav__item">Your Findings</Tab>
              )}
            </TabList>

            <section className="contest-page__tab-container full-width">
              {t.contestStatus === "completed" && (
                <TabPanel>
                  <div className="leaderboard__container leaderboard__container--contests">
                    <LeaderboardTableReduced
                      results={leaderboardResults}
                      isLoading={isLoading}
                    />
                  </div>
                </TabPanel>
              )}
              <TabPanel>
                <div className="limited-width type__copy">
                  {t.contestStatus === "soon" ? (
                    <div className="coming-soon tab__content--message">
                      <h2 className="type__headline__l">
                        Contest details coming soon
                      </h2>
                      <p>Check back when this contest launches in:</p>
                      <Countdown
                        start={start_time}
                        end={end_time}
                        isPreview={findingsRepo === ""}
                      />
                    </div>
                  ) : (
                    <div>
                      <ReactMarkdown
                        className={"markdown-body"}
                        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {`${fields.readmeContent}`}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </TabPanel>
              {t.contestStatus === "active" && (
                <TabPanel>
                  <div className="limited-width type__copy">
                    {findingsStatus === FindingsStatus.Error ? (
                      <div className="centered-text">
                        <h2>Oops! Something went wrong.</h2>
                        <p>{errorMessage}</p>
                      </div>
                    ) : (
                      <>
                        <FindingsList
                          key={currentUser.username}
                          findings={findingsList.user}
                          submissionPath={fields.submissionPath}
                          isLoading={findingsStatus === FindingsStatus.Fetching}
                        >
                          <WardenDetails
                            image={currentUser.image}
                            username={currentUser.username}
                          />
                        </FindingsList>
                        {currentUser.teams.map((team) => (
                          <FindingsList
                            key={team.username}
                            findings={findingsList.teams[team.username] || []}
                            submissionPath={fields.submissionPath}
                            isLoading={
                              findingsStatus === FindingsStatus.Fetching
                            }
                          >
                            <WardenDetails
                              image={team.image}
                              username={team.username}
                            />
                          </FindingsList>
                        ))}
                      </>
                    )}
                  </div>
                </TabPanel>
              )}
            </section>
          </Tabs>
        </ClientOnly>
      </div>
    </DefaultLayout>
  );
};
export default ContestLayout;

export const query = graphql`
  query contestLayoutQuery($contestId: Int) {
    markdownRemark: reportsJson(
      circa: { contest: { contestid: { eq: $contestId } } }
    ) {
      frontmatter: circa {
        altUrl
        slug
        title
      }
    }
    contestsCsv(contestid: { eq: $contestId }) {
      amount
      contestid
      details
      end_time
      fields {
        submissionPath
        readmeContent
        contestPath
        artPath
        status
        codeAccess
      }
      hide
      league
      repo
      findingsRepo
      start_time
      sponsor {
        name
        image {
          childImageSharp {
            resize(width: 160) {
              src
            }
          }
        }
        link
      }
      title
    }
  }
`;
