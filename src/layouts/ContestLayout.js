import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import clsx from "clsx";
import DefaultLayout from "./DefaultLayout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Countdown from "../components/Countdown";
import { getDates } from "../utils/time";
import ContestFAQ from "../pages/contests/faq";

const ContestLayout = (props) => {
  const [artOpen, setArtOpen] = useState(false);

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
  } = props.data.contestsCsv;

  const t = getDates(start_time, end_time);
  const dateDescription = `${amount}\n${t.startDay}—${t.endDay}`;
  const pageTitle = `Code4rena ${title}`;

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      bodyClass="contest-page"
      preview={fields.artPath}
      pageDescription={dateDescription}
    >
      <>
        <div className="contest-wrapper contest-artwork-wrapper">
          <div className="contest-tippy-top">
            {t.state === "soon" || t.state === "active" ? (
              <Countdown
                state={t.state}
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
          <div
            style={
              fields.artPath !== null
                ? { backgroundImage: `url(${fields.artPath})` }
                : null
            }
            onClick={() => setArtOpen((isOpen) => !isOpen)}
            className={clsx(
              { open: artOpen },
              "contest-artwork background-pattern"
            )}
            aria-label={`${title} artwork. Expands on click.`}
          />
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
              {t.state !== "soon" ? (
                <a
                  href={repo}
                  className="button cta-button button-medium primary"
                >
                  View Repo
                </a>
              ) : null}

              {t.state === "active" && findingsRepo && fields.submissionPath ? (
                <Link
                  to={fields.submissionPath}
                  className="button cta-button button-medium secondary"
                >
                  Submit Finding
                </Link>
              ) : null}
              {props.data.markdownRemark &&
              props.data.markdownRemark.frontmatter ? (
                <Link
                  to={`/reports/${props.data.markdownRemark.frontmatter.slug}`}
                  className="button cta-button button-medium primary"
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
              <Tab>Details</Tab>
              <Tab>FAQ</Tab>
            </TabList>

            <TabPanel>
              <div className="contest-wrapper">
                {t.state === "soon" ? (
                  <div className="coming-soon">
                    <h1>Contest details coming soon</h1>
                    <p>Check back when this contest launches in:</p>
                    <Countdown
                      state={t.state}
                      start={start_time}
                      end={end_time}
                      isPreview={findingsRepo === ""}
                      text={false}
                    />
                    <img
                      src="/images/icon-details.svg"
                      alt="icon of a piece of paper with lines on it to indicate text"
                    />
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: fields.readmeContent }}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="contest-wrapper">
                <ContestFAQ />
              </div>
            </TabPanel>
          </Tabs>
        </section>
      </>
    </DefaultLayout>
  );
};
export default ContestLayout;

export const myQuery = graphql`
  query MyQuery($contestId: Int) {
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
  }
`;
