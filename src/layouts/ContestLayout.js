import React, { useState } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "./DefaultLayout";
import ReactMarkdown from "react-markdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Countdown from "../components/Countdown";
import { getDates } from "../utils/time";
import ContestFAQ from "../pages/contests/faq";

const ContestLayout = (props) => {
  const [artOpen, setArtOpen] = useState(false);
  let artClass = artOpen ? "open" : null;
  const {
    title,
    sponsor,
    details,
    fields,
    amount,
    repo,
    findingsRepo,
    start_time,
    end_time,
  } = props.data.contestsCsv;

  // const artURL = "http://placeimg.com/1200/675/arch/grayscale";
  const artURL = "/images/contest_art/badger.jpg";

  const t = getDates(start_time, end_time);

  return (
    <DefaultLayout pageTitle={title} bodyClass="contest-page">
      <>
        <div class="contest-wrapper contest-artwork-wrapper">
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
          {t.state !== "active" ? (
            <p className="days-duration">{t.daysDuration} day contest</p>
          ) : null}
          <div
            style={{ backgroundImage: `url(${artURL})` }}
            onClick={() => setArtOpen((isOpen) => !isOpen)}
            className={`${artClass} contest-artwork background-pattern`}
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
          <div class="top-section-text">
            <h1 className="header-live">{title}</h1>
            <p>{details}</p>
            <div class="button-wrapper">
              <a
                href={fields.submissionPath}
                className="button cta-button button-medium primary"
              >
                Submit Finding
              </a>
              <a
                href={repo}
                className="button cta-button button-medium secondary"
              >
                View Contest Repo
              </a>
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
                {/* {t.state === "active" && repo ? (
        <a
          href={repo}
          className="contest-repo button button-small cta-button primary"
        >
          {`${findingsRepo === "" ? "Preview" : "View"} Repo`}
        </a>
      ) : (
        ""
      )} */}
                <ReactMarkdown children={fields.readmeContent} />
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
// https://github.com/code-423n4/2021-11-bootfinance/blob/main/core-contracts/diagrams/Overview.png
export default ContestLayout;

export const pageQuery = graphql`
  query ContestsId($contestId: Int) {
    contestsCsv(contestid: { eq: $contestId }) {
      amount
      contestid
      details
      end_time
      fields {
        submissionPath
        readmeContent
      }
      hide
      league
      repo
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
