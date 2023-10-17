import { graphql, Link } from "gatsby";
import Moralis from "moralis-v1";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";

// types
import { WardenFindingsForContest } from "../../types/finding";
// helpers
import { ContestStatus, getDates } from "../utils/time";
// hooks
import useUser from "../hooks/UserContext";
// components
import DefaultLayout from "./DefaultLayout";
import ClientOnly from "../components/ClientOnly";
import Countdown from "../components/Countdown";
import FindingsList from "../components/FindingsList";
import LeaderboardTableReduced from "../components/LeaderboardTableReduced";
import WardenDetails from "../components/WardenDetails";
import ContestStatusBar from "../components/contest/ContestStatusBar";

enum FindingsStatus {
  Fetching = "fetching",
  Error = "error",
  Success = "success",
}

const ContestLayout = ({ data }) => {
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

  // state
  // const [artOpen, setArtOpen] = useState(false);
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
  const [contestTimelineObject, setContestTimelineObject] = useState(
    getDates(start_time, end_time)
  );

  // hooks
  const { currentUser } = useUser();

  const dateDescription = `${amount}\n${contestTimelineObject.startDay}—${contestTimelineObject.endDay}`;
  const pageTitle = `Code4rena ${title}`;

  const canViewReport = Boolean(markdownRemark && markdownRemark.frontmatter);
  let reportUrl = "";
  if (canViewReport) {
    reportUrl = markdownRemark.frontmatter.altUrl
      ? markdownRemark.frontmatter.altUrl
      : `/reports/${data.markdownRemark.frontmatter.slug}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = getDates(start_time, end_time);
      const hasEnded = updatedTime.contestStatus === ContestStatus.Done;
      setContestTimelineObject(updatedTime);
      if (hasEnded) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [start_time]);

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
          headers: {
            "Content-Type": "application/json",
          },
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
            {contestTimelineObject.contestStatus === "soon" ||
              (contestTimelineObject.contestStatus === "active" && (
                <ContestStatusBar
                  findingsRepo={findingsRepo}
                  start_time={start_time}
                  end_time={end_time}
                  contestTimelineObject={contestTimelineObject}
                  contestNumber={contestid}
                  botRacePath={fields.submissionPath + "/bot"}
                  hasBotRace={
                    fields.codeAccess === "public" && contestid !== 241
                  }
                />
              ))}

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
                </div>
              </div>
              <div className="contest-page__button-wrapper">
                {contestTimelineObject.contestStatus !== "soon" &&
                  canViewContest && (
                    <a href={repo} className="button button--primary">
                      View Repo
                    </a>
                  )}

                {contestTimelineObject.contestStatus === "active" &&
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
                  {contestTimelineObject.startDay}
                </span>
              </li>
              <li className="contest-page__end-date">
                <span className="contest-page__grid-label">End Date</span>
                <span className="contest-page__grid-value type__headline__xs">
                  {contestTimelineObject.endDay}
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
                  {contestTimelineObject.daysDuration} days
                </span>
              </li>
            </ul>
          </section>
          <Tabs className="contest-page__tabs">
            <TabList className="limited-width secondary-nav">
              {contestTimelineObject.contestStatus === "completed" && (
                <Tab className="secondary-nav__item">Results</Tab>
              )}
              <Tab className="secondary-nav__item">Details</Tab>
              {contestTimelineObject.contestStatus === "active" && (
                <Tab className="secondary-nav__item">Your Findings</Tab>
              )}
            </TabList>

            <section className="contest-page__tab-container full-width">
              {contestTimelineObject.contestStatus === "completed" && (
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
                  {contestTimelineObject.contestStatus === "soon" ? (
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
              {contestTimelineObject.contestStatus === "active" && (
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
