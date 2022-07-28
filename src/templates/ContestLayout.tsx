import clsx from "clsx";
import { graphql, Link } from "gatsby";
import Moralis from "moralis";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// types
import { FindingsResponse } from "../../types/finding";
// helpers
import { getDates } from "../utils/time";
// hooks
import useUser from "../hooks/UserContext";
// components
import ClientOnly from "../components/ClientOnly";
import ContestResults from "../components/ContestResults";
import Countdown from "../components/Countdown";
import DefaultLayout from "./DefaultLayout";
import FindingsList from "../components/FindingsList";
import WardenDetails from "../components/WardenDetails";
import ReactMarkdown from "react-markdown";
// styles
import * as styles from "../components/reporter/widgets/Widgets.module.scss";

enum FindingsStatus {
  Fetching = "fetching",
  Error = "error",
  Success = "success",
}

const ContestLayout = (props) => {
  // state
  const [artOpen, setArtOpen] = useState(false);
  const [findingsList, setFindingsList] = useState<FindingsResponse>({
    user: [],
    teams: {},
  });
  const [findingsStatus, setFindingsStatus] = useState<FindingsStatus>(
    FindingsStatus.Fetching
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

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
  } = props.data.contestsCsv;

  const { markdownRemark } = props.data;

  const t = getDates(start_time, end_time);
  const dateDescription = `${amount}\n${t.startDay}—${t.endDay}`;
  const pageTitle = `Code4rena ${title}`;

  const canViewReport = Boolean(markdownRemark && markdownRemark.frontmatter);
  let reportUrl = "";
  if (canViewReport) {
    reportUrl = markdownRemark.frontmatter.altUrl
      ? markdownRemark.frontmatter.altUrl
      : `/reports/${props.data.markdownRemark.frontmatter.slug}`;
  }

  useEffect(() => {
    (async () => {
      if (currentUser.isLoggedIn) {
        const user = Moralis.User.current();
        const sessionToken = user?.attributes.sessionToken;

        try {
          // @todo: maybe store the response (or avoid re-fetching during navigation?)?
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
          const resultData: FindingsResponse = await response.json();

          setFindingsList(resultData);
          setFindingsStatus(FindingsStatus.Success);
        } catch (error) {
          setFindingsStatus(FindingsStatus.Error);
        }
      } else {
        setFindingsList({ user: [], teams: {} });
      }
    })();
  }, [currentUser, contestid]);

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="contest-page"
      preview={fields.artPath}
      pageDescription={dateDescription}
    >
      <ClientOnly>
        <div className="contest-wrapper contest-artwork-wrapper">
          <div className="contest-tippy-top">
            {t.contestStatus === "soon" || t.contestStatus === "active" ? (
              <Countdown
                start={start_time}
                end={end_time}
                isPreview={findingsRepo === ""}
              />
            ) : (
              <p>
                Contest ran {t.startDay}—{t.endDay}
              </p>
            )}
            <p className="days-duration">{t.daysDuration} day contest</p>
          </div>
          {fields.artPath !== null ? (
            <img
              src={fields.artPath}
              onClick={() => setArtOpen((isOpen) => !isOpen)}
              className={clsx(
                { open: artOpen },
                "contest-artwork background-pattern",
                "button-div"
              )}
              aria-label={`${title} artwork. Expands on click.`}
            />
          ) : (
            <button
              onClick={() => setArtOpen((isOpen) => !isOpen)}
              className={clsx(
                { open: artOpen },
                "contest-artwork background-pattern ",
                "button-div",
                "contest-artwork-default"
              )}
              aria-label={`${title} artwork. Expands on click.`}
            />
          )}
        </div>
        <section className="top-section contest-wrapper">
          <div className="sponsor-image">
            <a href={sponsor.link}>
              <img
                src={sponsor.image.childImageSharp.resize.src}
                alt={sponsor.name}
                width="90px"
                height="90px"
              />
            </a>
          </div>
          <div className="top-section-text">
            <h1>{title}</h1>
            <p>{details}</p>
            <div className="button-wrapper">
              {t.contestStatus !== "soon" ? (
                <a
                  href={repo}
                  className="button cta-button button-medium primary"
                >
                  View Repo
                </a>
              ) : null}

              {t.contestStatus === "active" &&
              findingsRepo &&
              fields.submissionPath ? (
                <Link
                  to={fields.submissionPath}
                  className="button cta-button button-medium secondary"
                >
                  Submit Finding
                </Link>
              ) : null}
              {canViewReport ? (
                <Link
                  to={reportUrl}
                  className="button cta-button button-medium secondary"
                >
                  View Report
                </Link>
              ) : null}
            </div>
          </div>
          <div className="top-section-amount">
            <p>{amount}</p>
            <p>Total Awards</p>
          </div>
        </section>
        <section>
          <Tabs className="contest-tabs">
            <TabList>
              {props.data.leaderboardFindings.findings.length > 0 && (
                <Tab>Results</Tab>
              )}
              <Tab>Details</Tab>
              {t.contestStatus === "active" && <Tab>Findings</Tab>}
            </TabList>

            {props.data.leaderboardFindings.findings.length > 0 && (
              <TabPanel>
                <div className="contest-wrapper">
                  <ContestResults results={props.data.leaderboardFindings} />
                </div>
              </TabPanel>
            )}
            <TabPanel>
              <div className="contest-wrapper">
                {t.contestStatus === "soon" ? (
                  <div className="coming-soon">
                    <h1>Contest details coming soon</h1>
                    <p>Check back when this contest launches in:</p>
                    <Countdown
                      start={start_time}
                      end={end_time}
                      isPreview={findingsRepo === ""}
                    />
                    <img
                      src="/images/icon-details.svg"
                      alt="icon of a piece of paper with lines on it to indicate text"
                    />
                  </div>
                ) : (
                  <article>
                    <ReactMarkdown
                      className={clsx(styles.Control, styles.Markdown)}
                      remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {`${fields.readmeContent}`}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </TabPanel>
            {t.contestStatus === "active" && (
              <TabPanel>
                <div className="contest-wrapper">
                  {findingsStatus === FindingsStatus.Error ? (
                    <div className="centered-text">
                      <h3>Oops! Something went wrong.</h3>
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
                          isLoading={findingsStatus === FindingsStatus.Fetching}
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
          </Tabs>
        </section>
      </ClientOnly>
    </DefaultLayout>
  );
};
export default ContestLayout;

export const query = graphql`
  query contestLayoutQuery($contestId: Int) {
    markdownRemark(
      frontmatter: { contest: { contestid: { eq: $contestId } } }
    ) {
      frontmatter {
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
    leaderboardFindings: contestsCsv(contestid: { eq: $contestId }) {
      title
      findings {
        finding
        awardUSD
        risk
        split
        handle {
          handle
          image {
            childImageSharp {
              resize(width: 40) {
                src
              }
            }
          }
          link
          members {
            handle
            image {
              childImageSharp {
                resize(width: 40) {
                  src
                }
              }
            }
            link
          }
        }
      }
    }
  }
`;
